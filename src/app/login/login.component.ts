import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirebaseService, User } from '../services/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  user$: Observable<User | null>
  sub: any

  constructor(
    private firebase: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user$ = this.firebase.currentUser$

    this.sub = this.user$.subscribe(user => this.router.navigate(['home']))
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  login() {
    this.firebase.signIn()
  }

  logout() {
    this.firebase.signOut()
  }

}
