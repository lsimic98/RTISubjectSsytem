import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../model/korisnik';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-zaposleni',
  templateUrl: './zaposleni.component.html',
  styleUrls: ['./zaposleni.component.css']
})
export class ZaposleniComponent implements OnInit {

  zaposleni: Korisnik[];

  constructor(
    private getterService: GetterService
  ) { }

  ngOnInit(): void {
    this.getterService.dohvatiZaposlene().subscribe((zaposleni: Korisnik[]) => {
      this.zaposleni = zaposleni;
    }); 
  }




}
