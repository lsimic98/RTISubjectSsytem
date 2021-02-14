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

  constructor(
    private getterService: GetterService
  ) { }

  ngOnInit(): void {
    this.getterService.dohvatiObavestenje().subscribe((obavestenja: Obavestenje[]) => {
      this.obavestenja = obavestenja;
    }); 
  }

  

}
