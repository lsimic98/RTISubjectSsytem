import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service';
import { RegisterService } from '../services/RegisterService/register.service';
import { SessionService } from '../services/SessionService/session.service';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit, OnDestroy {

  constructor(
    private _sessionService: SessionService,
    private _authService: AuthService,
    private _router: Router,
    private _registerService: RegisterService
  ) { }

  staraLozinka: string;
  novaLozinka: string;

  ngOnInit(): void {
    if(!this._sessionService.isSetUserSession() && !this._sessionService.isSetTmpSession())
      this._router.navigate(['/pocetna']);
  }
  
  promeniLozinku()
  {

    if(this._sessionService.isSetUserSession() && this.staraLozinka!=null && this.novaLozinka!=null)
    {
      if(this.staraLozinka === this._sessionService.getUserSession()['lozinka'])
      {
        this._registerService.promenaLozinke(
          this._sessionService.getUserSession()['korime'],
          this.staraLozinka,
          this.novaLozinka
        )
        .subscribe(
          (res) => {
            alert("Loznika uspesno promenjena");
            this._authService.logout();

          },
          (err) => {
            alert("Greska!");
          }

        );
        
      }
      else
      {
        alert("Pogresna stara loznika!");
      }

    }
    else if(this._sessionService.isSetTmpSession() && this.staraLozinka!=null && this.novaLozinka!=null)
    {
      if(this.staraLozinka === this._sessionService.getTmpSession()['lozinka'])
      {
        this._registerService.promenaLozinke(
          this._sessionService.getTmpSession()['korime'],
          this.staraLozinka,
          this.novaLozinka
        )
        .subscribe(
          (res) => {
            alert("Loznika uspesno promenjena");
            this._authService.logout();

          },
          (err) => {
            alert("Greska!");
          }

        );
      }
      else
      {
        alert("Pogresna stara loznika!");
      }
    }
    else
    alert("Morate uneti sva polja!");


  }

  ngOnDestroy()
  {
    this._sessionService.clearTmpSession();
  }
}
