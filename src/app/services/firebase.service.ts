// tslint:disable:no-console
import 'rxjs/Rx'
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { Note } from '../models';
import { Observable } from 'rxjs/Observable';
import * as lodash from 'lodash';
export type User = firebase.User

const config = {
  apiKey: 'AIzaSyC4BVoO5I8V0zcojeeLbz3kASuehpdL004',
  authDomain: 'ng-algorlia-functions.firebaseapp.com',
  databaseURL: 'https://ng-algorlia-functions.firebaseio.com',
  projectId: 'ng-algorlia-functions',
  storageBucket: 'ng-algorlia-functions.appspot.com',
  messagingSenderId: '166741232362'
};


@Injectable()
export class FirebaseService {

  private provider: firebase.auth.GoogleAuthProvider
  currentUser$ = new ReplaySubject<User | null>(1)
  notes$ = new ReplaySubject<Note[] | null>(1)
  isActive$: Observable<boolean>

  editableNote$ = new Subject<Note>()

  constructor(
    private http: Http,
  ) {
    firebase.initializeApp(config);

    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/plus.login');

    firebase.auth().onAuthStateChanged((user: User) => {
      if (user) {
        this.currentUser$.next(user)
        this.reloadNotes()
      } else {
        this.currentUser$.next(null)
        this.notes$.next(null)
      }
    });

    this.isActive$ = Observable
      .combineLatest(this.currentUser$, this.notes$)
      .map(([user, notes]) => !!user && !!notes)
  }

  signIn() {
    firebase.auth().signInWithPopup(this.provider)
      .then(result => {
        console.log('SIGN IN')
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch(err => {
        console.error(err)
        this.currentUser$.next(null)
      });
  }

  signOut() {
    firebase.auth().signOut()
      .then(() => {
        console.log('SIGN OUT')
      })
      .catch(err => {
        console.error(err)
        this.currentUser$.next(null)
      })
  }

  reloadNotes(...noteIds: string[]): void {
    if (noteIds && noteIds.length > 0) {
      Observable
        .from(noteIds.map(noteId => this.getNoteById(noteId)))
        .mergeMap(note => note)
        .scan((p, note) => [...p, note], [])
        .subscribe(notes => {
          const orderedNotes = lodash.orderBy(notes, 'timestamp', 'desc')
          this.notes$.next(orderedNotes)
        })
      // Promise
      //   .all(noteIds.map(noteId => this.getNoteById(noteId)))
      //   .then(notes => {
      //     const orderedNotes = lodash.orderBy(notes, 'timestamp', 'desc')
      //     this.notes$.next(orderedNotes)
      //   })
    } else {
      this.getNotes()
        .then(notes => {
          const orderedNotes = lodash.orderBy(notes, 'timestamp', 'desc')
          this.notes$.next(orderedNotes)
        })
    }
  }

  async getNotes(): Promise<Note[]> {
    const limit = 10
    const user = firebase.auth().currentUser
    if (user) {
      return firebase.database().ref('notes/' + user.uid).orderByChild('timestamp').limitToLast(limit).once('value')
        .then(snapshot => {
          if (snapshot && snapshot.val()) { // userがnoteのデータを持っている場合。
            const obj = snapshot.val()
            return Object.keys(obj).map(key => {
              const note: Note = obj[key]
              note.id = key
              return note
            })
          } else { // userが一つもnoteのデータを持っていない場合。
            return []
          }
        })
    } else {
      throw new Error('user is not defined.')
    }
  }

  async getNoteById(noteId: string): Promise<Note> {
    const user = firebase.auth().currentUser
    if (user) {
      return firebase.database().ref('notes/' + user.uid + '/' + noteId).once('value')
        .then(snapshot => {
          const note: Note = snapshot.val()
          note.id = noteId
          return note
        })
    } else {
      throw new Error('user is not defined.')
    }
  }

  async saveNote(note: Note): Promise<void> {
    const user = firebase.auth().currentUser
    if (user) {
      try {
        let key: string;
        if (note.id) { // 編集モード
          await firebase.database().ref('notes/' + user.uid + '/' + note.id).set(note)
          key = note.id
          console.log('updated note key:', key)
        } else { // 追加モード
          const ref: { key: string } = await firebase.database().ref('notes/' + user.uid).push(note)
          key = ref.key
          console.log('added note key:', key)
        }
        this.reloadNotes(key)
      } catch (err) {
        throw err
      }
    } else {
      throw new Error('user is not defined.')
    }
  }

  async searchNote(keyword: string): Promise<any> {
    const subject = new Subject<any>()
    const user = firebase.auth().currentUser
    if (user) {
      console.time('searchNote')
      await firebase.database().ref('search/' + user.uid).remove()
      firebase.database().ref('search/' + user.uid + '/query').set({ keyword })
      const ref = firebase.database().ref('search/' + user.uid + '/results')
      ref.on('value', snapshot => {
        if (snapshot && snapshot.val()) {
          const obj = snapshot.val()
          if (obj.hits) {
            console.timeEnd('searchNote')
            ref.off()
            subject.next(obj)
          }
        }
      })
      return subject.take(1).toPromise()
    } else {
      throw new Error('user is not defined.')
    }
  }

  async searchNoteApi(keyword: string): Promise<any> {
    const user = firebase.auth().currentUser
    if (user) {
      console.time('searchNoteApi')
      const endpoint = 'https://us-central1-ng-algorlia-functions.cloudfunctions.net/api/search'
      const token: string = await user.getIdToken()
      const headers = new Headers({
        'Authorization': 'Bearer ' + token
      })
      return this.http.post(endpoint, { keyword }, { headers })
        .do(() => console.timeEnd('searchNoteApi'))
        .map(res => res.json())
        .toPromise()
    } else {
      throw new Error('user is not defined.')
    }
  }

}
