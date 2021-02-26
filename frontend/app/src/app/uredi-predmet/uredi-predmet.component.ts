import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Datum } from '../model/datum';
import { Fajl } from '../model/fajl';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { PlanAngazovanja } from '../model/planAngazovanja';
import { Predmet } from '../model/predmet';
import { Spisak } from '../model/spisak';
import { FileUploadService } from '../services/FileUpload/file-upload.service';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-uredi-predmet',
  templateUrl: './uredi-predmet.component.html',
  styleUrls: ['./uredi-predmet.component.css']
})
export class UrediPredmetComponent implements OnInit {

  username: string;
  role: string;
  korisnik: any;

  obavestenje: ObavestenjePredmet;
  datumObjaveObavestenja: Datum;
  obavestenja: ObavestenjePredmet[];

  novoObavestenje: ObavestenjePredmet;
  noviDatumObjaveObavestenja: Datum;

  predmet: Predmet;
  planAngazovanja: PlanAngazovanja[];

  fajlovi: Fajl[];
  noviRedosledPredavanja: Set<string>;
  noviRedosledVezbi: Set<string>;
  noviRedosledIspita: Set<string>;

  novoPredavanje: File;
  novaVezba: File;
  noviIspit: File;
  noviLab: File;
  noviProjekat: File;

  trenutniPredmet: string;
  trenutnoObavestenje: string;
  statusnaPoruka: string;

  //Spiskovi
  noviSpisak: Spisak;
  spiskovi: Spisak[];
  spisak: Spisak;
  spisakIndex: number;

  noviDatumOdrzavanjaSpiska: Datum;
  noviDatumZatvaranjaSpiska: Datum;


  datumZatvaranjaSpiska: Datum;
  datumOdrzavanjaSpiska: Datum;




  //END_spiskovi

  
  
  constructor(
    private getterService: GetterService,
    private setterService: SetterService,
    private sessionService: SessionService,
    private fileUploadService: FileUploadService,
    private httpClient: HttpClient,
    private router: Router
  ) { 
    this.predmet = null;
  }

  ngOnInit(): void {
    this.korisnik = this.sessionService.getUserSession();
    this.datumObjaveObavestenja = new Datum();
    this.novoObavestenje = new ObavestenjePredmet();
    this.noviDatumObjaveObavestenja = new Datum();

    this.username = null;
    this.role = null;
    this.trenutniPredmet = null;
    this.trenutnoObavestenje = null;
    this.statusnaPoruka = null;

    //Spsikovi
    this.noviSpisak = new Spisak();
    this.noviDatumOdrzavanjaSpiska = new Datum();
    this.noviDatumZatvaranjaSpiska = new Datum();
    this.spisakIndex = -1;

    this.datumOdrzavanjaSpiska = new Datum();
    this.datumZatvaranjaSpiska = new Datum();
    //end_Spiskovi

    this.noviRedosledPredavanja = new Set();
    this.noviRedosledVezbi = new Set();
    this.noviRedosledIspita = new Set();

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      if(this.role === 'zaposlen')
      {
        this.getterService.dohvatiPlanAngazovanja(this.username).subscribe(
          (planAngazovanja: PlanAngazovanja[]) => {
            if(planAngazovanja)
              this.planAngazovanja = planAngazovanja;
          }
        );

        

      }
      else if(this.role === 'admin')
      {
        this.getterService.dohvatiSvePlanoveAngazovanja().subscribe(
          (planAngazovanja: PlanAngazovanja[]) => {
            if(planAngazovanja)
              this.planAngazovanja = planAngazovanja;
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


  izaberiPredmet(event: any){
    if(
      event.target.value != null && 
      event.target.value != 'null' && 
      event.target.value != this.trenutniPredmet
      ){
        this.trenutniPredmet = event.target.value;
        this.getterService.dohvatiPredmetPoSifri(this.trenutniPredmet).subscribe((predmet: Predmet) => {
          this.predmet = predmet;
        });

        this.getterService.dohvatiPredmetObavestenja(this.trenutniPredmet).subscribe(
          (obavestenja: ObavestenjePredmet[]) => {
            if(obavestenja){
              this.obavestenja = obavestenja;
              this.trenutnoObavestenje = null;
              this.obavestenje = null;
            }
          }
        );

        this.getterService.dohvatiFajloveZaPredmet(this.trenutniPredmet).subscribe(
          (fajlovi: Fajl[]) => {
            if(fajlovi){
              this.fajlovi = fajlovi;
            }
          }
        );
      }

      this.getterService.dohvatiSpiskove(this.trenutniPredmet).subscribe(
        (spiskovi: Spisak[]) => {
          if(spiskovi){
            this.spiskovi = spiskovi;
          }

        }
      );
  }

  izaberiObavestenje(event: any)
  {
    if(
      event.target.value != null && 
      event.target.value != 'null' && 
      event.target.value != this.trenutnoObavestenje
      ){
        this.trenutnoObavestenje = event.target.value;
        this.getterService.dohvatiPredmetObavestenjeId(this.trenutnoObavestenje).subscribe((obavestenje: ObavestenjePredmet) => {
          this.obavestenje = obavestenje;
          this.datumObjaveObavestenja.datum = obavestenje.datumObjave.toLocaleString().match(/\d{4}-\d{2}-\d{2}/g).pop();
          this.datumObjaveObavestenja.vreme = obavestenje.datumObjave.toLocaleString().match(/\d{2}:\d{2}:\d{2}/g).pop();

          console.log(obavestenje.datumObjave.toLocaleString());
        });
      }
  }

  azurirajPredmetInfo()
  {
    this.setterService.azurirajPredmetInfo(this.predmet).subscribe(
      (res) => {
        alert("Osnovne informacije o prednetu uspesno azurirane!");
      },
      (err) => {
        alert(err);
      }
    )



  }


  

  azurirajIspitiInfo()
  {
 
      this.setterService.azurirajIspitInfo(this.predmet.sifraPredmeta, this.predmet.ispitiVidljiv).subscribe(
        (res) => {
          alert("Informacije o ispitnim pitanjima uspešno ažurirane!");
        },
        (err) => {
          alert(err);
        },
      );
    
  }

  azurirajLabInfo()
  {
    if(this.predmet.labInfo != null)
    {
      this.setterService.azurirajLabInfo(this.predmet.sifraPredmeta, this.predmet.labInfo, this.predmet.labVidljiv).subscribe(
        (res) => {
          alert("Informacije o laboratorijskim vežbama uspešno ažurirane!");
        },
        (err) => {
          alert(err);
        },
      );
    }
  }

  azurirajProjekatInfo()
  {
    if(this.predmet.projekatInfo != null)
    {
      this.setterService.azurirajProjekatInfo(this.predmet.sifraPredmeta, this.predmet.projekatInfo, this.predmet.projekatVidljiv).subscribe(
        (res) => {
          alert("Informacije o projektu/domaćem zadatku  uspešno ažurirane!");
        },
        (err) => {
          alert(err);
        },
      );
    }
  }

  azurirajObavestenje()
  {
    this.obavestenje.datumObjave = this.datumObjaveObavestenja.kreirajDatum();
    this.setterService.azurirajObavestenje(this.obavestenje).subscribe( (res)  => {
      alert(res['poruka']);
    });

   
    
  }

  dodajObavestenje(){

  }

  izbrisiObavestenje()
  {
    console.log(this.datumObjaveObavestenja.datum);
    console.log(this.datumObjaveObavestenja.vreme);
    console.log(this.datumObjaveObavestenja.kreirajDatum())

  }

  izbrisiFajl(fajlSaPutanjom: number, id: number)
  {
    // alert(fajlSaPutanjom);
    let fileIndex = this.fajlovi.indexOf(this.fajlovi[fajlSaPutanjom], 0);
    let path = 'uploads/';
    switch(id)
    {
      case 1: //predavanja
      {
        path += this.predmet.sifraPredmeta + '/' +this.fajlovi[fajlSaPutanjom].podFolder + '/' + this.fajlovi[fajlSaPutanjom].naziv;
        this.setterService.izbrisiFajl(path).subscribe((res) => {
          if(res)
          {
            alert("Fajl usepsno izbrisan");
            let nameIndex = this.predmet.predavanja.indexOf(this.fajlovi[fajlSaPutanjom].naziv, 0);
            if(fileIndex > -1){
              this.fajlovi.splice(fileIndex, 1);
            }
            if(nameIndex > -1){
              this.predmet.predavanja.splice(nameIndex, 1);
            }
            this.noviRedosledPredavanja.clear();
                      
          }
          else{
            alert("Fajl nije uspesno izbrisan");
          }
        });

      }
      break;
      case 2: //vezbe
      {
        path += this.predmet.sifraPredmeta + '/' +this.fajlovi[fajlSaPutanjom].podFolder + '/' + this.fajlovi[fajlSaPutanjom].naziv;
        this.setterService.izbrisiFajl(path).subscribe((res) => {
          if(res)
          {
            alert("Fajl usepsno izbrisan");
            let nameIndex = this.predmet.vezbe.indexOf(this.fajlovi[fajlSaPutanjom].naziv, 0);//vezbe
            if(fileIndex > -1){
              this.fajlovi.splice(fileIndex, 1);
            }
            if(nameIndex > -1){
              this.predmet.vezbe.splice(nameIndex, 1);//vezbe
            }
            this.noviRedosledVezbi.clear();//noviRedosledVezbi
                      
          }
          else{
            alert("Fajl nije uspesno izbrisan");
          }
        });
      }
      break;
      case 3: //ispiti
      {
        path += this.predmet.sifraPredmeta + '/' +this.fajlovi[fajlSaPutanjom].podFolder + '/' + this.fajlovi[fajlSaPutanjom].naziv;
        this.setterService.izbrisiFajl(path).subscribe((res) => {
          if(res)
          {
            alert("Fajl usepsno izbrisan");
            let nameIndex = this.predmet.ispiti.indexOf(this.fajlovi[fajlSaPutanjom].naziv, 0);//ispiti
            if(fileIndex > -1){
              this.fajlovi.splice(fileIndex, 1);
            }
            if(nameIndex > -1){
              this.predmet.ispiti.splice(nameIndex, 1);//ispiti
            }
            this.noviRedosledIspita.clear();//noviRedosledIspita
                      
          }
          else{
            alert("Fajl nije uspesno izbrisan");
          }
        });
      }
      break;
      case 4: //lab
      {
        path += this.predmet.sifraPredmeta + '/' +this.fajlovi[fajlSaPutanjom].podFolder + '/' + this.fajlovi[fajlSaPutanjom].naziv;
        this.setterService.izbrisiFajl(path).subscribe((res) => {
          if(res)
          {
            alert("Fajl usepsno izbrisan");
            let nameIndex = this.predmet.lab.indexOf(this.fajlovi[fajlSaPutanjom].naziv, 0);//lab
            if(fileIndex > -1){
              this.fajlovi.splice(fileIndex, 1);
            }
            if(nameIndex > -1){
              this.predmet.lab.splice(nameIndex, 1);//lab
            }                      
          }
          else{
            alert("Fajl nije uspesno izbrisan");
          }
        });
      }
      break;
      case 5: //projekat
      {
        path += this.predmet.sifraPredmeta + '/' +this.fajlovi[fajlSaPutanjom].podFolder + '/' + this.fajlovi[fajlSaPutanjom].naziv;
        this.setterService.izbrisiFajl(path).subscribe((res) => {
          if(res)
          {
            alert("Fajl usepsno izbrisan");
            let nameIndex = this.predmet.projekat.indexOf(this.fajlovi[fajlSaPutanjom].naziv, 0);//projekat
            if(fileIndex > -1){
              this.fajlovi.splice(fileIndex, 1);
            }
            if(nameIndex > -1){
              this.predmet.projekat.splice(nameIndex, 1);//projekat
            }                      
          }
          else{
            alert("Fajl nije uspesno izbrisan");
          }
        });
      }
      break;
    }


  }

  //RedosledPredmeta
  ubaciUNoviRedosled(redosled: string, id: number)
  { 
    console.log(redosled);
    console.log(id);
    switch(id)
    {
      case 1: //predavanja
        this.noviRedosledPredavanja.add(redosled);
        break;
      case 2: //vezbe
        this.noviRedosledVezbi.add(redosled);
        break;
      case 3: //ispiti
        this.noviRedosledIspita.add(redosled);
        break;
    }
  }
  ponistiNoviRedosled(id: number)
  {
    switch(id)
    {
      case 1: //predavanja
        this.noviRedosledPredavanja.clear();
        break;
      case 2: //vezbe
        this.noviRedosledVezbi.clear();
        break;
      case 3: //ispiti
        this.noviRedosledIspita.clear();
        break;
    }
 
  }
  izmeniRedosled(id: number)
  {
    switch(id)
    {
      case 1: //predavanja
        if(this.predmet.predavanja.length === this.noviRedosledPredavanja.size)
        {
          this.setterService
          .azurirajRedosledPredmeta(this.predmet._id, this.predmet.sifraPredmeta, 'predavanja', this.noviRedosledPredavanja)
          .subscribe(
            (res: any) => {
            alert('Redosled fajlova uspesno promenjen!');
            this.predmet.predavanja = Array.from(this.noviRedosledPredavanja.values());
            this.noviRedosledPredavanja.clear();
          },
          (err) => {
            alert(err);
          }
          );

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
        break;
      case 2: //vezbe
        if(this.predmet.vezbe.length === this.noviRedosledVezbi.size)
        {
          this.setterService
          .azurirajRedosledPredmeta(this.predmet._id, this.predmet.sifraPredmeta, 'vezbe', this.noviRedosledVezbi)
          .subscribe(
            (res: any) => {
            alert('Redosled fajlova uspesno promenjen!');
            this.predmet.vezbe = Array.from(this.noviRedosledVezbi.values());
            this.noviRedosledVezbi.clear();
          },
          (err) => {
            alert(err);
          }
          );

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
        break;
      case 3: //ispiti
        if(this.predmet.ispiti.length === this.noviRedosledIspita.size)
        {
          this.setterService
          .azurirajRedosledPredmeta(this.predmet._id, this.predmet.sifraPredmeta, 'ispiti', this.noviRedosledIspita)
          .subscribe(
            (res: any) => {
            alert('Redosled fajlova uspesno promenjen!');
            this.predmet.ispiti = Array.from(this.noviRedosledIspita.values());
            this.noviRedosledIspita.clear();
          },
          (err) => {
            alert(err);
          }
          );

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
        break;
    }
  }
  //END_RedosledPredmeta

  izaberiFajl(event: any, id: number)
  {
    if(event.target.files.length > 0){
      switch(id)
      {
        case 1: //predavanja
          this.novoPredavanje = event.target.files[0];
        break;

        case 2: //vezbe
          this.novaVezba = event.target.files[0];
        break;

        case 3: //ispiti
         this.noviIspit = event.target.files[0];
        break;

        case 4: //lab
          this.noviLab = event.target.files[0];
        break;

        case 5: //projekat
          this.noviProjekat = event.target.files[0];
        break;
      }
    }
  }
  postaviFajl(id: number)
  {
    switch(id)
    {
      case 1: //predavanja
      {
        if(this.novoPredavanje != null){
          let path = this.predmet.sifraPredmeta + '/predavanja';
          this.fileUploadService.uploadSingle(this.novoPredavanje, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
            (ubacenFajl: Fajl) => {
              alert("Fajl upešno postavljen!");
              this.predmet.predavanja.push(this.novoPredavanje.name);
              this.fajlovi.push(ubacenFajl);
            },
            (err) => { alert(err) }
          );
        }
      }
      break;

      case 2: //vezbe
      {
        if(this.novaVezba != null){ //novaVezba
          let path = this.predmet.sifraPredmeta + '/vezbe'; // /vezbe
          //this.novaVezba
          this.fileUploadService.uploadSingle(this.novaVezba, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
            (ubacenFajl: Fajl) => {
              alert("Fajl upešno postavljen!");
              this.predmet.vezbe.push(this.novaVezba.name);  //vezbe, novaVezba
              this.fajlovi.push(ubacenFajl);
            },
            (err) => { alert(err) }
          );
        }
      }
      break;
      
      case 3: //ispiti
      {
        if(this.noviIspit != null){ //noviIspit
          let path = this.predmet.sifraPredmeta + '/ispiti'; // /ispiti
          //this.noviIspit
          this.fileUploadService.uploadSingle(this.noviIspit, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
            (ubacenFajl: Fajl) => {
              alert("Fajl upešno postavljen!");
              this.predmet.ispiti.push(this.noviIspit.name);  //ispiti, noviIspit
              this.fajlovi.push(ubacenFajl);
            },
            (err) => { alert(err) }
          );
        }
      }
      break;

      case 4: //lab
      {
        if(this.noviLab != null){ //noviIspit
          let path = this.predmet.sifraPredmeta + '/lab'; // /ispiti
          //this.noviLab
          this.fileUploadService.uploadSingle(this.noviLab, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
            (ubacenFajl: Fajl) => {
              alert("Fajl upešno postavljen!");
              this.predmet.lab.push(this.noviLab.name);  //ispiti, noviLab
              this.fajlovi.push(ubacenFajl);
            },
            (err) => { alert(err) }
          );
        }
      }
      break;

      case 5: //projekat
      {
        if(this.noviProjekat != null){ //noviProjekat
          let path = this.predmet.sifraPredmeta + '/projekat'; // /projekat
          //this.noviProjekat
          this.fileUploadService.uploadSingle(this.noviProjekat, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
            (ubacenFajl: Fajl) => {
              alert("Fajl upešno postavljen!");
              this.predmet.projekat.push(this.noviProjekat.name);  //projekat, noviProjekat
              this.fajlovi.push(ubacenFajl);
            },
            (err) => { alert(err) }
          );
        }
      }
      break;
    }

  }

  izaberiPredavanje(event){
    if(event.target.files.length > 0)
      this.novoPredavanje = event.target.files[0]; 
  }
  postaviPredavanje(){
    if(this.novoPredavanje != null){
      let path = this.predmet.sifraPredmeta + '/predavanja';
      this.fileUploadService.uploadSingle(this.novoPredavanje, path, this.korisnik.korime, this.korisnik.ime, this.korisnik.prezime).subscribe( 
        (ubacenFajl: Fajl) => {
          alert("Fajl upešno postavljen!");
          this.predmet.predavanja.push(this.novoPredavanje.name);
          this.fajlovi.push(ubacenFajl);
        },
        (err) => { alert(err) }
      );
    }

  }
  izaberiVezbu(event){

  }
  postaviVezbu(){

  }
  izaberiIspit(event){

  }
  postaviIspit(){

  }
  izaberiLab(event){

  }
  postaviLab(){

  }
  izaberiProjekat(event){


  }
  postaviProjekat(){

  }

  napraviSpisak(){
    if(
      this.noviSpisak.naziv != null &&
      this.noviSpisak.mestoOdrzavanja != null &&
      this.noviSpisak.maxBrojStudenata > -1 &&
      this.noviDatumOdrzavanjaSpiska.datum != "" && 
      this.noviDatumOdrzavanjaSpiska.vreme != "" && 
      this.noviDatumZatvaranjaSpiska.datum != "" && 
      this.noviDatumZatvaranjaSpiska.vreme != "" 

    )
    {
      this.noviSpisak.datumOtvaranja = new Date();
      this.noviSpisak.datumOdrzavanja = this.noviDatumOdrzavanjaSpiska.kreirajDatum();
      this.noviSpisak.datumZatvaranja = this.noviDatumZatvaranjaSpiska.kreirajDatum();
      this.noviSpisak.trenutniBrojStudenata = 0;
      this.noviSpisak.sifraPredmeta = this.predmet.sifraPredmeta;
      this.noviSpisak.folder = this.noviSpisak.naziv.replace(/ /g,"_") + "_" + this.predmet.sifraPredmeta + "_"+ this.noviSpisak.datumOtvaranja.getTime();
      this.noviSpisak.otvoren = true;


      this.setterService.napraviNoviSpisak(this.noviSpisak).subscribe(
        (res) => {
          alert("Spisak uspesno napravljen!");
          this.spiskovi.push(this.noviSpisak);
          this.noviSpisak = new Spisak();

          //dodaj u sve spiskove

        },
        (err) => {
          alert(err);

        }
      );
    }
  }


  

  izaberiSpisak($event)
  {
    console.group($event.target.value);
    if($event.target.value > -1 && $event.target.value!=this.spisakIndex){
      this.spisak = this.spiskovi[$event.target.value];
      this.spisakIndex = $event.target.value;

      this.datumOdrzavanjaSpiska.datum = this.spisak.datumOdrzavanja.toLocaleString().match(/\d{4}-\d{2}-\d{2}/g).pop();
      this.datumOdrzavanjaSpiska.vreme = this.spisak.datumOdrzavanja.toLocaleString().match(/\d{2}:\d{2}:\d{2}/g).pop();

      this.datumZatvaranjaSpiska.datum = this.spisak.datumZatvaranja.toLocaleString().match(/\d{4}-\d{2}-\d{2}/g).pop();
      this.datumZatvaranjaSpiska.vreme = this.spisak.datumZatvaranja.toLocaleString().match(/\d{2}:\d{2}:\d{2}/g).pop();
    }
  }

  azurirajSpisak()
  {
    if(
      this.spisak.naziv != null &&
      this.spisak.mestoOdrzavanja != null &&
      this.spisak.maxBrojStudenata > -1 &&
      this.datumOdrzavanjaSpiska.datum != "" && 
      this.datumOdrzavanjaSpiska.vreme != "" && 
      this.datumZatvaranjaSpiska.datum != "" && 
      this.datumZatvaranjaSpiska.vreme != "" 

    )
    {
      this.spisak.datumOdrzavanja = this.datumOdrzavanjaSpiska.kreirajDatum();
      this.spisak.datumZatvaranja = this.datumZatvaranjaSpiska.kreirajDatum();

      this.setterService.azurirajSpisak(this.spisak).subscribe(
        (res) => {
          alert('Spisak uspesno azuriran!');
          this.spisak.folder = res['noviFolder'];

        },
        (err) => {
          alert(err);
        }
      );
    




    }
    else
    {
      alert("Morate uneti sva polja!");
    }

  


  }

  izbrisiSpisak()
  {
    this.setterService.izbrisiSpisak(this.spisak.folder).subscribe(
      (res) => {
        alert("Spisak uspesno izbrisan!");
        this.spisak = null;
        if(this.spisakIndex > -1){
          this.spiskovi.splice(this.spisakIndex, 1);
          this.spisakIndex = -1;
        }
        
      },
      (err) => {
        alert(err);
      }
    );

  }

 
 





}
