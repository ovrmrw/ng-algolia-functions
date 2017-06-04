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
    return this.firebase.isActive$
      .do(isActive => console.log('AuthGuard:', isActive))
      .do(isActive => {
        if (!isActive) {
          this.router.navigate(['login'])
        }
      })
  }
}
