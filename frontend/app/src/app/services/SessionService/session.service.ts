import { Injectable } from '@angular/core';
import { Korisnik } from 'src/app/model/korisnik';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  isSetUserSession(): boolean {
    return !!localStorage.getItem('user');
  }

  clearUserSession() {
    localStorage.removeItem('user');
  }

  setUserSession(user: Korisnik) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserSession(){
    return JSON.parse(localStorage.getItem('user'));
  }


  clearSession()
  {
    localStorage.clear();
  }



  //TMP Session
  setTmpSession(tmp: any)
  {
    localStorage.setItem('tmp', JSON.stringify(tmp));
  }

  clearTmpSession()
  {
    localStorage.removeItem('tmp');
  }

  getTmpSession(){
    return JSON.parse(localStorage.getItem('tmp'));
  }

  isSetTmpSession(): boolean {
    return !!localStorage.getItem('tmp');
  }
}
