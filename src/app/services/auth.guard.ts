import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private firebase: FirebaseService,
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.firebase.currentUser$
      .do(user => console.log('AuthGuard:', user))
      .do(user => {
        if (!user) {
          this.router.navigate(['login'])
        }
      })
      .map(user => !!user)
  }
}
