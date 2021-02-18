import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Obavestenje } from '../model/obavestenje';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { PlanAngazovanja } from '../model/planAngazovanja';
import { Predmet } from '../model/predmet';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-uredi-predmet',
  templateUrl: './uredi-predmet.component.html',
  styleUrls: ['./uredi-predmet.component.css']
})
export class UrediPredmetComponent implements OnInit {

  username: string;
  role: string;
  obavestenje: ObavestenjePredmet;
  obavestenja: ObavestenjePredmet[];
  predmet: Predmet;
  planAngazovanja: PlanAngazovanja[];
  trenutniPredmet: string;
  trenutnoObavestenje: string;
  
  
  constructor(
    private getterService: GetterService,
    private setterService: SetterService,
    private sessionService: SessionService,
    private httpClient: HttpClient,
    private router: Router
  ) { 
    this.predmet = null;
  }

  ngOnInit(): void {
    this.username = null;
    this.role = null;
    this.trenutniPredmet = null;
    this.trenutnoObavestenje = null;

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      if(this.role === 'zaposlen')
      {
        this.getterService.dohvatiPlanAngazovanja(this.username).subscribe(
          (planAngazovanja: PlanAngazovanja[]) => {
            if(planAngazovanja)
              this.planAngazovanja = planAngazovanja;
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


  izaberiPredmet(event: any){
    if(
      event.target.value != null && 
      event.target.value != 'null' && 
      event.target.value != this.trenutniPredmet
      ){
        this.trenutniPredmet = event.target.value;
        this.getterService.dohvatiPredmetPoSifri(this.trenutniPredmet).subscribe((predmet: Predmet) => {
          this.predmet = predmet;
        });

        this.getterService.dohvatiPredmetObavestenja(this.trenutniPredmet).subscribe(
          (obavestenja: ObavestenjePredmet[]) => {
            if(obavestenja)
              this.obavestenja = obavestenja;
          }
        );
      }
  }

  izaberiObavestenje(event: any)
  {
    if(
      event.target.value != null && 
      event.target.value != 'null' && 
      event.target.value != this.trenutnoObavestenje
      ){
        this.trenutnoObavestenje = event.target.value;
        this.getterService.dohvatiPredmetObavestenjeId(this.trenutnoObavestenje).subscribe((obavestenje: ObavestenjePredmet) => {
          this.obavestenje = obavestenje;
        });
      }


  }

  azurirajPredmet()
  {


  }

  azurirajPredavanja()
  {
    
  }

  azurirajVezbe()
  {
    
  }

  azurirajIspitnaPitanja()
  {
    
  }

  azurirajLab()
  {
    
  }

  azurirajProjekat()
  {
    
  }

  izbrisiObavestenje()
  {

  }




}
