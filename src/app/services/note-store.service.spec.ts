import { TestBed, inject } from '@angular/core/testing';

import { NoteStoreService } from './note-store.service';

describe('NoteStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteStoreService]
    });
  });

  it('should be created', inject([NoteStoreService], (service: NoteStoreService) => {
    expect(service).toBeTruthy();
  }));
});
