import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Datum } from '../model/datum';
import { Fajl } from '../model/fajl';
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
  ime: string;
  prezime: string;
  role: string;
  korisnik: any;

  obavestenja: ObavestenjePredmet[];
  datumObjaveObavestenja: Datum;
  obavestenje: ObavestenjePredmet;
  obavestenjeIndex: number;
  obavestenjeFajlovi: Fajl[];
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

    
    this.noviDatumObavestenja = new Datum();
    this.novaSifraPredmeta = [];


    this.username = null;
    this.role = null;
    this.trenutnoObavestenje = null;
    this.predmeti = null;
    this.files = null;
    this.obavestenjeIndex = -1;

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.ime = this.sessionService.getUserSession().ime;
      this.prezime = this.sessionService.getUserSession().prezime;
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
    if(
      this.obavestenje.naslov != null && 
      this.obavestenje.sifraPredmeta.length > 0 && 
      this.obavestenje.sadrzaj != null &&
      this.datumObjaveObavestenja.datum != "" &&
      this.datumObjaveObavestenja.vreme != "" 
      )
      {
        this.obavestenje.datumObjave = this.datumObjaveObavestenja.kreirajDatum();
        this.setterService.azurirajObavestenjePredmeta(this.obavestenje).subscribe(
          (res) => {
            alert("Obavestenje uspesno azurirano!");
            this.obavestenje.folder = res['noviFolder'];
            alert(res['noviFolder']);
          },
          (err) => {
            alert(err);
          }
        )

      }


  }

  izbrisiObavestenje()
  {
    
    

    this.setterService.izbrisiObavestenjePredmeta(this.obavestenje.folder).subscribe(
      (res) => {
        alert("Obavestenje uspesno izbrisano!");
        this.obavestenje = null;
        this.obavestenjeFajlovi = null;
        if(this.obavestenjeIndex > -1){
          this.obavestenja.splice(this.obavestenjeIndex, 1);
          this.obavestenjeIndex = -1;
        }
        
      },
      (err) => {
        alert(err);
      }
    );



  }



  izaberiObavestenje($event)
  {
    if($event.target.value != "null"){
      // console.log($event.target.value);
      this.obavestenje = this.obavestenja[+$event.target.value];
      this.obavestenjeIndex = +$event.target.value;
      this.datumObjaveObavestenja.datum = this.obavestenje.datumObjave.toLocaleString().match(/\d{4}-\d{2}-\d{2}/g).pop();
      this.datumObjaveObavestenja.vreme = this.obavestenje.datumObjave.toLocaleString().match(/\d{2}:\d{2}:\d{2}/g).pop();
      
      this.getterService.dohvatiFajloveZaObavestenjePredmeta(this.obavestenje.folder).subscribe(
        (fajlovi: Fajl[]) => {
          this.obavestenjeFajlovi = fajlovi;
        }
      );
    }
  }



  dodajObavestenje()
  {
    if(
      this.noviNaslov != null && 
      this.novaSifraPredmeta.length > 0 && 
      this.noviSadrzaj != null &&
      this.noviDatumObavestenja.datum != "" &&
      this.noviDatumObavestenja.vreme != "" 
      )
      {
        if(this.files!=null)
        {
          this.novoObavestenje = new ObavestenjePredmet();
          this.novoObavestenje.fajlovi = [];
          this.novoObavestenje.datumObjave = this.noviDatumObavestenja.kreirajDatum();
          this.novoObavestenje.naslov = this.noviNaslov;
          this.novoObavestenje.sadrzaj = this.noviSadrzaj;
          this.novoObavestenje.sifraPredmeta = this.novaSifraPredmeta;
          this.novoObavestenje.folder = this.noviNaslov.replace(/ /g,"_") + "_" + Date.now();
          this.novoObavestenje.starijiOd7Dana = false;

          this.setterService.dodajObavestenjaSaFajlovima(
            this.novoObavestenje,
            this.files,
            this.username,
            this.ime,
            this.prezime
            ).subscribe(
            (res) => {
              alert(res['poruka']);
              this.noviDatumObavestenja.vreme = "";
              for(let fajl of this.files){
                this.novoObavestenje.fajlovi.push(fajl.name);
              }
              // this.obavestenja.push(this.novoObavestenje);
            },
            (err) => {
              alert(err);
              // this.noviDatumObavestenja.vreme = "";
            }
          );

  
        }
        else //Bez fajlova
        {
          this.novoObavestenje = new ObavestenjePredmet();
          this.novoObavestenje.datumObjave = this.noviDatumObavestenja.kreirajDatum();
          // console.log(this.novoObavestenje.datumObjave);
          this.novoObavestenje.naslov = this.noviNaslov;
          this.novoObavestenje.sadrzaj = this.noviSadrzaj;
          this.novoObavestenje.sifraPredmeta = this.novaSifraPredmeta;
          this.novoObavestenje.folder = this.noviNaslov.replace(/ /g,"_") + "_" + this.novoObavestenje.datumObjave.getTime();
          this.novoObavestenje.starijiOd7Dana = false;

          this.setterService.dodajObavestenjaBezFajlova(this.novoObavestenje).subscribe(
            (res) => {
              alert(res['poruka']);
              // this.noviDatumObavestenja.vreme = "";
              this.obavestenja.push(this.novoObavestenje);
            },
            (err) => {
              alert(err);
              // this.noviDatumObavestenja.vreme = "";
            }
          );

          
          
  
        }
      }
      else{
        alert("Morate uneti sva polja");
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
