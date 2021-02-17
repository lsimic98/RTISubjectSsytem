import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { Predmet } from '../model/predmet';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-predmet-info',
  templateUrl: './predmet-info.component.html',
  styleUrls: ['./predmet-info.component.css']
})
export class PredmetInfoComponent implements OnInit {

  predmet: Predmet;
  obavestenja: ObavestenjePredmet[];
  datum7: Date;
  isDataLoaded: boolean;
  id: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private getterService: GetterService
  ) {  
    
      this.isDataLoaded=false;
      this.activatedRouter.params.toPromise().then();
   }
  

  ngOnInit(): void {
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
          });
        }
      );
      
 

 

    
    
    

   
  }



}
