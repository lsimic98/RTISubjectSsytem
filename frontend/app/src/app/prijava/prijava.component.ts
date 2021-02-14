import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../model/korisnik';
import { AuthService } from '../services/AuthService/auth.service';
import { SessionService } from '../services/SessionService/session.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private _sessionService: SessionService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.errorMessage = null;
  }

  username: string;
  password: string;
  errorMessage: string;

  login(){

    if(this.username!=null && this.password!=null)
    {
      this.authService.login(this.username, this.password).subscribe((korisnik: Korisnik)=> {
        if(korisnik)
        {
          this._sessionService.setUserSession(korisnik);
          this.authService.loggedInNext(this._sessionService.isSetUserSession());
          this.authService.setUserRole(korisnik.tip);
          this.authService.setUsername(korisnik.korime);
          this._router.navigate(['/pocetna']);
        }
        else
        {
          this.password = null;
          this.errorMessage = "Pogrešno korisničko ime ili lozinka!"
        }
      });
    }
    else
    {
      this.errorMessage = "Morate uneti korisničko ime i lozinku!"
    }

  }

}
