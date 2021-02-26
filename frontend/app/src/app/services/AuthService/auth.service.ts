import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from '../SessionService/session.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<string>(null);
  private username = new BehaviorSubject<string>(null);
  private fullname = new BehaviorSubject<string>(null);
  private uri = 'http://localhost:4000';

  constructor(
    private httpClient: HttpClient,
    private _sessionService: SessionService,
    private _router: Router
    ) 
    {
      let userSession =  _sessionService.getUserSession();
      if(userSession != null)
      {
        this.loggedIn.next(true);
        this.role.next(userSession.tip);
        this.username.next(userSession.korime);
        this.fullname.next(userSession.ime + ' ' + userSession.prezime)
      }
    }

  get isLoggedIn() 
  {
    return this.loggedIn.asObservable();
  }

  get getUserRole()
  {
    return this.role.asObservable();
  }

  get getUsername()
  {
    return this.username.asObservable();
  }

  get getFullname()
  {
    return this.fullname.asObservable();
  }

  loggedInNext(nextValue: boolean){
    this.loggedIn.next(nextValue);
  }

  setUserRole(userRole: string){
    this.role.next(userRole);
  }
  setUsername(username: string){
    this.username.next(username);
  }

  setFullname(fullname: string){
    this.fullname.next(fullname);
  }
  

 
   login(username: string, password: string){
    const data = {
      username: username,
      password: password
    }

    return this.httpClient.post(`${this.uri}/login`, data);

  }

  logout() {
    // this._sessionService.clearUserSession();
    this._sessionService.clearSession();
    this.loggedIn.next(this._sessionService.isSetUserSession());
    this.role.next(null); 
    this.username.next(null); 
    this.fullname.next(null);
    return this._router.navigate(['/pocetna']);
  }



}
