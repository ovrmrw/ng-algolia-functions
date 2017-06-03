import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as firebase from 'firebase';
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

  provider: firebase.auth.GoogleAuthProvider
  currentUser$ = new ReplaySubject<User | null>(1)

  constructor() {
    firebase.initializeApp(config);

    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/plus.login');

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser$.next(user)
      } else {
        this.currentUser$.next(null)
      }
    });
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
}
