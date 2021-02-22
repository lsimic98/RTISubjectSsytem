import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Datum } from '../model/datum';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { FileUploadService } from '../services/FileUpload/file-upload.service';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-obavestenje-predmet',
  templateUrl: './obavestenje-predmet.component.html',
  styleUrls: ['./obavestenje-predmet.component.css']
})
export class ObavestenjePredmetComponent implements OnInit {

  username: string;
  role: string;
  korisnik: any;

  obavestenja: ObavestenjePredmet[];
  datumObjaveObavestenja: Datum;
  obavestenje: ObavestenjePredmet;
  predmeti: string[];

  files: File[];
  


  

  //Novo Obavestenje
  novoObavestenje: ObavestenjePredmet;

  noviNaslov: string;
  noviSadrzaj: string;
  novaSifraPredmeta: string[];
  noviDatumObavestenja: Datum;

  
 

  trenutnoObavestenje: string;


  constructor(    
    private getterService: GetterService,
    private setterService: SetterService,
    private sessionService: SessionService,
    private fileUploadService: FileUploadService,
    private httpClient: HttpClient,
    private router: Router
  )
  {
     

  }

  ngOnInit(): void {
    this.korisnik = this.sessionService.getUserSession();
    this.datumObjaveObavestenja = new Datum();
    this.novoObavestenje = new ObavestenjePredmet();
    this.noviDatumObavestenja = new Datum();

    this.username = null;
    this.role = null;
    this.trenutnoObavestenje = null;
    this.predmeti = null;
    this.files = null;

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      this.predmeti = this.sessionService.getUserSession().predmeti;
      if(this.role === 'zaposlen')
      {
        this.getterService.dohvatiObavestenjaZaPredmete(this.predmeti).subscribe(
          (obavestenja: ObavestenjePredmet[]) => 
          {
            this.obavestenja = obavestenja;
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


  azurirajObavestenje()
  {
    console.log(this.datumObjaveObavestenja.datum);
    console.log(this.datumObjaveObavestenja.vreme);
    console.log(this.datumObjaveObavestenja.kreirajDatum());
    console.log(this.obavestenje.datumObjave)

  }

  izbrisiObavestenje()
  {

  }



  izaberiObavestenje($event)
  {
    if($event.target.value != "null"){
      // console.log($event.target.value);
      this.obavestenje = this.obavestenja[+$event.target.value];
      this.datumObjaveObavestenja.datum = this.obavestenje.datumObjave.toLocaleString().match(/\d{4}-\d{2}-\d{2}/g).pop();
      this.datumObjaveObavestenja.vreme = this.obavestenje.datumObjave.toLocaleString().match(/\d{2}:\d{2}:\d{2}/g).pop();
    }
  }



  dodajObavestenje()
  {
    if(this.files!=null)
    {
      console.log(this.files);

    }
    else
    {

    }

  }

  selectMultipleFiles(event)
  {
    if(event.target.files.length > 0)
    {
      this.files =  event.target.files;
    }

  }



}
