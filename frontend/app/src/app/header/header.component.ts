import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/AuthService/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  username$: Observable<string>;
  fullname$: Observable<string>;
  role$: Observable<string>;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.isLoggedIn;
    this.username$ = this.authService.getUsername;
    this.fullname$ = this.authService.getFullname;
    this.role$ = this.authService.getUserRole;
  }

  logout()
  {
    this.authService.logout();
  }

}
