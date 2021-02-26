import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Korisnik } from '../model/korisnik';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { Predmet } from '../model/predmet';
import { Spisak } from '../model/spisak';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-predmet-info',
  templateUrl: './predmet-info.component.html',
  styleUrls: ['./predmet-info.component.css']
})
export class PredmetInfoComponent implements OnInit {

  predmet: Predmet;
  obavestenja: ObavestenjePredmet[];
  spiskovi: Spisak[];
  fajl: File = null;
  datum7: Date;
  isDataLoaded: boolean;
  id: string;
  korisnik: any;
  prijavljen: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private getterService: GetterService,
    private setterService: SetterService,
    private sessionService: SessionService
  ) {  
    
      this.isDataLoaded=false;
      this.activatedRouter.params.toPromise().then();
   }
  

  ngOnInit(): void {
    if(this.sessionService.isSetUserSession())
    {
      this.prijavljen = true;
      this.korisnik = this.sessionService.getUserSession();
    }
    this.isDataLoaded = false;
    this.activatedRouter.params.subscribe(params => {
    this.getterService.dohvatiPredmetPoSifri(params['id']).toPromise().then(
        (predmet: Predmet) => {
          if(predmet)
            this.predmet = predmet;
            this.getterService.dohvatiPredmetObavestenja(params['id']).toPromise().then(
              (obavestenja: ObavestenjePredmet[]) => {
      
                if(obavestenja){
                  this.obavestenja = obavestenja;

                  this.datum7 = new Date();
                  this.datum7.setDate(this.datum7.getDate() - 7);
              
                  for(let i in this.obavestenja)
                  {
                    if(Date.parse(this.obavestenja[i].datumObjave.toString()) > this.datum7.getTime()){
                      this.obavestenja[i].starijiOd7Dana = true;
                    }
                    else{
                      this.obavestenja[i].starijiOd7Dana = false;
                    }
                 
                  }

                  this.isDataLoaded= true;
                }
                  
              }
            );

            this.getterService.dohvatiSpiskove(params['id']).subscribe(
              (spiskovi: Spisak[]) => {
                this.spiskovi = spiskovi;
              }
            );
           
          });
        }
      );
      
 

 

    
    
    

   
  }
  izaberiFajl(event)
  {
    if(event.target.files.length > 0){
      this.fajl = event.target.files[0];
      console.log(event);
    }

  }


  prijavaNaSpisakFajl(spisak: Spisak)
  {
    if(this.fajl != null){
      console.log(this.fajl);
      this.setterService.prijavaNaSpisakFajl(spisak, this.fajl, this.korisnik.korime,this.korisnik.ime,this.korisnik.prezime).subscribe(
        (res) => {
          console.log(res);
          alert("Uspesno ste se prijavili na spisak!")
        },
        (err) => {
          alert(err);
        }
      );

    }

  }

  prijavaNaSpisak(spisak: Spisak)
  {
      this.setterService.prijavaNaSpisak(spisak, this.korisnik.korime).subscribe(
        (res) => {
        console.log(res);
        alert("Uspesno ste se prijavili na spisak!")
      },
      (err) => {
        alert(err);
      }
    );

  }



}
