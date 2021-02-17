import { Component, OnInit } from '@angular/core';
import { Obavestenje } from '../model/obavestenje';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-obavestenja',
  templateUrl: './obavestenja.component.html',
  styleUrls: ['./obavestenja.component.css']
})
export class ObavestenjaComponent implements OnInit {

  obavestenja: Obavestenje[];
  isDataLoaded: boolean;

  constructor(
    private getterService: GetterService
  ) { }

  ngOnInit(): void {
    this.isDataLoaded = false;
    this.getterService.dohvatiObavestenje().subscribe((obavestenja: Obavestenje[]) => {
      if(obavestenja)
        this.obavestenja = obavestenja;
        this.isDataLoaded = true;;
    }); 
  }

  

}
