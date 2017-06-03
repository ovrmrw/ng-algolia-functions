import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyC4BVoO5I8V0zcojeeLbz3kASuehpdL004',
  authDomain: 'ng-algorlia-functions.firebaseapp.com',
  databaseURL: 'https://ng-algorlia-functions.firebaseio.com',
  projectId: 'ng-algorlia-functions',
  storageBucket: 'ng-algorlia-functions.appspot.com',
  messagingSenderId: '166741232362'
};
firebase.initializeApp(config);

@Injectable()
export class LoginService {

  constructor() { }

}
