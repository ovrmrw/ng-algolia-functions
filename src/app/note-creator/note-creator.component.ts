import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Note } from '../models';

@Component({
  selector: 'app-note-creator',
  templateUrl: './note-creator.component.html',
  styleUrls: ['./note-creator.component.css']
})
export class NoteCreatorComponent implements OnInit {

  noteForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private firebase: FirebaseService,
  ) { }

  ngOnInit() {
    this.noteForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      author: ['', Validators.required],
      content: ['', Validators.required],
    })

    this.firebase.editableNote$
      .filter<Note>(note => !!note)
      .subscribe(note => {
        this.noteForm.patchValue({
          id: note.id,
          title: note.title,
          author: note.author,
          content: note.content,
        } as Note)
      })
  }

  onSubmit() {
    try {
      if (this.noteForm.valid) {
        const note: Note = this.noteForm.value
        note.timestamp = new Date().getTime()
        this.firebase.saveNote(note)
          .then(() => {
            this.noteForm.reset()
          })
      } else {
        alert('入力内容が不完全です。')
      }
    } catch (err) {
      throw err;
    }
  }

}
