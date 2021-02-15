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
  isDataLoaded: number;

  constructor(
    private activatedRouter: ActivatedRoute,
    private getterService: GetterService
  ) {
      this.isDataLoaded = 0;

   }
  

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.getterService.dohvatiPredmetPoSifri(params['id']).subscribe(
        (predmet: Predmet) => {
          if(predmet)
            this.predmet = predmet;
            this.isDataLoaded += 1;
        }
      );
      
      this.getterService.dohvatiPredmetObavestenja(params['id']).subscribe(
        (obavestenja: ObavestenjePredmet[]) => {

          if(obavestenja)
            this.obavestenja = obavestenja;
            this.isDataLoaded += 1;
        }
      );
    });

    this.datum7 = new Date();
    this.datum7.setDate(this.datum7.getDate() - 7);

    for(let i in this.obavestenja)
    {
      console.log(i);
    }

    
    

   
  }



}
