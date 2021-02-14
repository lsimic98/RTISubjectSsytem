import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Korisnik } from '../model/korisnik';
import { GetterService } from '../services/GetterService/getter.service';

@Component({
  selector: 'app-zaposlen-info',
  templateUrl: './zaposlen-info.component.html',
  styleUrls: ['./zaposlen-info.component.css']
})
export class ZaposlenInfoComponent implements OnInit {

  constructor(
    private activatedRouter: ActivatedRoute,
    private getterService: GetterService
  ) { }

  private sub: any;
  zaposlen: Korisnik;


  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.getterService.dohvatiZaposlenog(params['id']).subscribe(
        (zaposlen: Korisnik) => {
          if(zaposlen)
            this.zaposlen = zaposlen;
        }
      );
    });
  }

}
