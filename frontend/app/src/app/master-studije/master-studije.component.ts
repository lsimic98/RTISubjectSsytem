import { Component, OnInit } from '@angular/core';
import { Odsek } from '../model/odsek';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-master-studije',
  templateUrl: './master-studije.component.html',
  styleUrls: ['./master-studije.component.css']
})
export class MasterStudijeComponent implements OnInit {

  predmetiPoOdseku: Odsek[];
  odsek: string;
  isDataLoaded: boolean;

  constructor(
    private getterService: GetterService
  ) { }

  ngOnInit(): void {
    this.isDataLoaded = false;
  
      this.getterService.dohvatiPredmetePoOdesku('Master').subscribe(
        (predmetiPoOdseku: Odsek[]) => {
          if(predmetiPoOdseku)
            this.predmetiPoOdseku = predmetiPoOdseku;
          this.isDataLoaded = true;
        }
        
      );
    
  }

}
