import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Output() editEvent = new EventEmitter<string>()
  @Input() noteId: string;
  @Input() title: string;
  @Input() author: string;
  @Input() content: string;

  constructor() { }

  ngOnInit() {
  }

  edit() {
    this.editEvent.emit(this.noteId)
  }
}
