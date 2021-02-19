import { ContentObserver } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Datum } from '../model/datum';
import { Fajl } from '../model/fajl';
import { ObavestenjePredmet } from '../model/obavestenjePredmet';
import { PlanAngazovanja } from '../model/planAngazovanja';
import { Predmet } from '../model/predmet';
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
    this.datumObjaveObavestenja = new Datum();
    this.novoObavestenje = new ObavestenjePredmet();
    this.noviDatumObjaveObavestenja = new Datum();

    this.username = null;
    this.role = null;
    this.trenutniPredmet = null;
    this.trenutnoObavestenje = null;
    this.statusnaPoruka = null;

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

  azurirajPredmet()
  {



  }

  azurirajPredavanja()
  {
    
  }

  azurirajVezbe()
  {
    
  }

  azurirajIspitnaPitanja()
  {
    
  }

  azurirajLab()
  {
    
  }

  azurirajProjekat()
  {
   
    
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

  izbrisiFajl(fajlSaPutanjom: number)
  {
    alert(fajlSaPutanjom);

  }

  ubaciUNoviRedosled(redosled: string, id: number)
  { 
    console.log(redosled);
    console.log(id);
    switch(id)
    {
      case 1:
        this.noviRedosledPredavanja.add(redosled);
        break;
      case 2:
        this.noviRedosledVezbi.add(redosled);
        break;
      case 3:
        this.noviRedosledIspita.add(redosled);
        break;
    }
  }

  ponistiNoviRedosled(id: number)
  {
    switch(id)
    {
      case 1:
        this.noviRedosledPredavanja.clear();
        break;
      case 2:
        this.noviRedosledVezbi.clear();
        break;
      case 3:
        this.noviRedosledIspita.clear();
        break;
    }
 
  }
  izmeniRedosled(id: number)
  {
    switch(id)
    {
      case 1:
        if(this.predmet.predavanjaM.length === this.noviRedosledPredavanja.size)
        {

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
        break;
      case 2:
        if(this.predmet.vezbeM.length === this.noviRedosledVezbi.size)
        {

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
        break;
      case 3:
        if(this.predmet.ispitiM.length === this.noviRedosledIspita.size)
        {

        }
        else
          alert('Morate navesti redosled sa svim fajlovima!');
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
      this.fileUploadService.uploadSingle(this.novoPredavanje, path).subscribe( 
        (res) => { 
          alert(res + "\n" + "Fajl upešno postavljen!");
          this.predmet.predavanjaM.push(this.novoPredavanje.name);
          
          
          
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

 
 





}
