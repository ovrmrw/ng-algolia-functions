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

  isActive$: Observable<boolean>
  sub: any

  constructor(
    private firebase: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isActive$ = this.firebase.isActive$

    this.sub = this.isActive$
      .filter(isActive => isActive)
      .subscribe(() => this.router.navigate(['home']))
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
