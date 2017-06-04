import 'rxjs/Rx'
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Note } from '../models';

@Injectable()
export class NoteStoreService {

  notes$ = new ReplaySubject<Note[]>(1)

  constructor() { }

}
