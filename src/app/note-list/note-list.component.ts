import { Component, OnInit } from '@angular/core';
import { Note } from '../models';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {

  notes$: Observable<Note[] | null>

  constructor(
    private firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.notes$ = this.firebase.notes$

    this.notes$.subscribe(notes => console.log('notes:', notes))
  }

  prepareEditNote(noteId: string) {
    this.notes$
      .filter<Note[]>(notes => !!notes)
      .mergeMap(notes => Observable.from(notes))
      .filter(note => note.id === noteId)
      .take(1)
      .subscribe(note => {
        this.firebase.editableNote$.next(note)
      })
  }

}
