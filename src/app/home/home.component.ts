import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private firebase: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  logout() {
    this.firebase.signOut()
    this.router.navigate(['welcome'])
  }

  searchNote() {
    this.firebase.searchNote('野口')
      .then(results => {
        console.log('search results:', results)
        this.firebase.reloadNotes(...results.noteIds)
      })
  }
}
