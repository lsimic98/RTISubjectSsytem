import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../model/korisnik';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-zaposlen-update',
  templateUrl: './zaposlen-update.component.html',
  styleUrls: ['./zaposlen-update.component.css']
})
export class ZaposlenUpdateComponent implements OnInit {

  zaposlen: Korisnik;
  username: string;
  role: string;
  message: string;


  constructor(
    private sessionService: SessionService,
    private getterService: GetterService,
    private setterService: SetterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.message = null;
    this.username = null;
    this.role = null

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      if(this.role === 'zaposlen')
      {
        this.getterService.dohvatiZaposlenog(this.username).subscribe(
          (zaposlen: Korisnik) => {
            if(zaposlen)
              this.zaposlen = zaposlen;
          }
        );

      }
      else{
        this.router.navigate(['/greska']);
      }

    }
    else{
      this.router.navigate(['/greska']);
    }
  }


  update()
  {
    this.setterService.azurirajKorisnika(this.zaposlen).subscribe((res)=>{
        this.message = res['poruka'];
    });

  }

}
