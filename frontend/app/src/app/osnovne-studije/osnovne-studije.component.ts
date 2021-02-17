import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Odsek } from '../model/odsek';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-osnovne-studije',
  templateUrl: './osnovne-studije.component.html',
  styleUrls: ['./osnovne-studije.component.css']
})
export class OsnovneStudijeComponent implements OnInit {

  predmetiPoOdseku: Odsek[];
  odsek: string;
  isDataLoaded: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private getterService: GetterService
  ) { }

  ngOnInit(): void {
    this.isDataLoaded = false;
    this.activatedRouter.params.subscribe(params => {
      this.odsek = params['id'];
      this.getterService.dohvatiPredmetePoOdesku(this.odsek).subscribe(
        (predmetiPoOdseku: Odsek[]) => {
          if(predmetiPoOdseku)
            this.predmetiPoOdseku = predmetiPoOdseku;
          this.isDataLoaded = true;
        }
        
      );
    });
  }

  

}
