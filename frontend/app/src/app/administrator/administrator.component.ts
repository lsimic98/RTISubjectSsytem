import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Grupa } from '../model/grupa';
import { Korisnik } from '../model/korisnik';
import { PlanAngazovanja } from '../model/planAngazovanja';
import { Predmet } from '../model/predmet';
import { FileUploadService } from '../services/FileUpload/file-upload.service';
import { GetterService } from '../services/GetterService/getter.service';
import { RegisterService } from '../services/RegisterService/register.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {


  predmeti: Predmet[];
  korisnici: Korisnik[];
  planoviAngazovanja: PlanAngazovanja[];

  username: string;
  role: string;

    //Student
    ime: string;
    prezime: string;
    lozinka: string;
    lozinka2: string;
    brojIndeksa: string;
    tipStudija: string;
    errorMessage: string;
    brojIndeksaRegex: any;

    student: Korisnik;
    studentIndex: number;
    studentStaroKorime: string;
    //END_Student
  

    //Zaposlen
    zaposlen: Korisnik;
    zaposlenIndex: number;
    zaposlenStaroKorime: string;
    noviZaposlen: Korisnik;
    //END_Zaposlen

    //Predmeti
    predmet: Predmet;
    predmetIndex: number;
    staraSifraPredmeta: string;
    noviPredmet: Predmet;
    //END_Predmeti


    //planAngazovanja
    noviPlanAngazovanja: PlanAngazovanja;
    planAngazovanjaIndex: number;
    planAngazovanja: PlanAngazovanja;
    planAngazovanjaPredavaci: Set<string>;
    //END_planAngazovanja


    //Obavestenja

    //END_Obavestenja


  constructor(
    private getterService: GetterService,
    private setterService: SetterService,
    private sessionService: SessionService,
    private fileUploadService: FileUploadService,
    private httpClient: HttpClient,
    private _registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Student
    this.brojIndeksaRegex = new RegExp('^[1-2][0-9]{3}[/][0-9]{4}$');
    this.tipStudija = "d";
    this.studentIndex = -1;
    //END_Student


    //Zaposlen
    this.noviZaposlen = new Korisnik();
    this.zaposlenIndex = -1;
    //END_Zaposlen

    //Predmeti
    this.noviPredmet = new Predmet();
    this.predmetIndex = -1;
    //END_Predmeti

    //planAngazovanja
    this.noviPlanAngazovanja = new PlanAngazovanja();
    this.planAngazovanjaIndex = -1;
    this.planAngazovanjaPredavaci = new Set();
    //END_planAngazovanja

    if(this.sessionService.isSetUserSession())
    {
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      if(this.role === 'admin')
      {
        this.getterService.dohvatiSveKorisnike().subscribe(
          (korisnici: Korisnik[]) => {
            this.korisnici = korisnici;
          },
          (err) => {
            alert(err);
          }
        );

        this.getterService.dohvatiSvePredmete().subscribe(
          (predmeti: Predmet[]) => {
            this.predmeti = predmeti;
          },
          (err) => {
            alert(err);
          }
        );

        this.getterService.dohvatiSvePlanoveAngazovanja().subscribe(
          (planoviAngazovanja: PlanAngazovanja[]) => {
            this.planoviAngazovanja = planoviAngazovanja;
          },
          (err) => {
            alert(err);
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

  uzmiStudente(){
    return this.korisnici.filter((item) => item.tip === 'student');
  }

  izbrisiStudenta(){
    this.setterService.izbrisiStudenta(this.studentStaroKorime).subscribe(
      (res) => {
        alert('Student usepesno izbrisan!');
        this.student = null;
        if(this.studentIndex > -1){
          this.korisnici.splice(this.studentIndex, 1);
          this.studentIndex = -1;
        }
      },
      (err) => {
        alert(err);
      }
    );


  }

  azurirajStudenta(){
    if(
        this.student.ime != null &&
        this.student.prezime != null &&
        this.student.brojIndeksa != null &&
        this.brojIndeksaRegex.test(this.student.brojIndeksa) &&
        this.student.tipStudija != null &&
        this.student.lozinka != null &&
        this.student.status != null 

    )
    {
      this.setterService.azurirajStudenta(this.student, this.studentStaroKorime).subscribe(
        (res) => {
          alert("Student uspesno azuriran!");
          this.studentStaroKorime = this.student.prezime[0] + this.student.ime[0] + this.student.brojIndeksa[2] + this.student.brojIndeksa[3] 
          + this.student.brojIndeksa.split('/')[1] + this.student.tipStudija;
          this.studentStaroKorime = this.studentStaroKorime.toLowerCase();
        },
        (err) => {
          alert(err);
        }
      );

    }
    else
    {
      alert('Morate uneti sva polja u ispravnom formatu!');
    }

  }

  izaberiStudenta($event){
    if($event.target.value > -1 && this.studentIndex != $event.target.value)
    {
      // console.log($event.target.value)
      // console.log(this.korisnici[+$event.target.value])
      this.student = this.korisnici[$event.target.value];
      this.studentIndex = $event.target.value;
      this.studentStaroKorime = this.student.korime;
    }

  }

 




  registerStudnet()
  {
    if(this.ime!=null && this.prezime!=null && this.lozinka!=null && this.lozinka2!=null && this.brojIndeksa!=null && this.tipStudija!=null)
    {
      if(this.brojIndeksaRegex.test(this.brojIndeksa))
      {
        if(this.lozinka == this.lozinka2)
        {
          this._registerService.registerStudent(
            this.ime, this.prezime, this.lozinka, this.brojIndeksa, this.tipStudija, 'neaktivan'
          ).subscribe((res) => {
            if(res['status']===false)
              alert('Korisnik sa ovim brojem indeksa vec postoji');
            else{  
              alert("Student uspesno registrovan!");
              let noviStudent = new Korisnik();
              noviStudent.ime = this.ime;
              noviStudent.prezime = this.prezime;
              noviStudent.lozinka = this.lozinka;
              noviStudent.brojIndeksa = this.brojIndeksa;
              noviStudent.tipStudija = this.tipStudija;
              noviStudent.status = 'neaktivan';
              noviStudent.korime = this.prezime[0] + this.ime[0] + this.brojIndeksa[2] +this.brojIndeksa[3] 
              + this.brojIndeksa.split('/')[1] + this.tipStudija;

              this.korisnici.push(noviStudent);
            }
          });

        }
        else
        {
          alert("Lozinka i ponovljena lozinka moraju biti iste!");
        }
      }
      else
      {
        alert("Broj indeksa mora biti u foramtu GGGG/BBBB !");
      }
    }
    else{
      alert("Morate uneti sva polja!");
    }

  }


  //Zaposlen
  izaberiZaposlenog($event)
  {
    if($event.target.value > -1 && this.zaposlenIndex != $event.target.value)
    {
      // console.log($event.target.value)
      // console.log(this.korisnici[+$event.target.value])
      this.zaposlen = this.korisnici[$event.target.value];
      this.zaposlenIndex = $event.target.value;
      this.zaposlenStaroKorime = this.student.korime;
    }


  }

  azurirajZaposlenog()
  {
    if(
      this.zaposlen.korime!=null &&
      this.zaposlen.lozinka!=null &&
      this.zaposlen.ime!=null &&
      this.zaposlen.prezime!=null &&
      this.zaposlen.zvanje!=null &&
      this.zaposlen.adresa!=null &&
      this.zaposlen.brojKabineta!=null
    )
    {
      this.setterService.azurirajZaposlenog(this.zaposlen, this.zaposlenStaroKorime).subscribe(
        (res) => {
          alert("Zaposlen uspesno azuriran!");
          this.zaposlenStaroKorime = this.zaposlen.korime;
        },
        (err) => {
          alert(err);
        }
      );


    }


  }

  dodajZaposlenog()
  {
    if(
      this.noviZaposlen.korime!=null &&
      this.noviZaposlen.lozinka!=null &&
      this.noviZaposlen.ime!=null &&
      this.noviZaposlen.prezime!=null &&
      this.noviZaposlen.zvanje!=null &&
      this.noviZaposlen.adresa!=null &&
      this.noviZaposlen.brojKabineta!=null
    )
    {
      this.setterService.dodajZaposlenog(this.noviZaposlen).subscribe(
        (res) => {
          if(res['status']===false)
            alert('Zaposlen sa korisnikim imenom poostoji!');
          else
          {
            alert("Student uspesno registrovan!");
            this.korisnici.push(this.noviZaposlen);
            this.noviZaposlen = new Korisnik();
          }
        },
        (err) => {
          alert(err);
        }
      );

    }

  }

  izbrisiZaposlenog()
  {
    this.setterService.izbrisiZaposlenog(this.zaposlenStaroKorime).subscribe(
      (res) => {
        alert('Zaposlen usepesno izbrisan!');
        this.zaposlen = null;
        if(this.zaposlenIndex > -1){
          this.korisnici.splice(this.zaposlenIndex, 1);
          this.zaposlenIndex = -1;
        }
      },
      (err) => {
        alert(err);
      }
    );
    

  }

  //Predmeti 

  izaberiPredmet($event)
  {
    if($event.target.value > -1 && this.predmetIndex != $event.target.value)
    {
      // console.log($event.target.value)
      // console.log(this.korisnici[+$event.target.value])
      this.predmet = this.predmeti[$event.target.value];
      this.predmetIndex = $event.target.value;
      this.staraSifraPredmeta = this.predmet.sifraPredmeta;
    }

  }

  azurirajPredmet()
  {
    if(
      this.predmet.naziv != null &&
      this.predmet.sifraPredmeta != null &&
      this.predmet.tip != null &&
      this.predmet.godina != null &&
      this.predmet.semestar != null &&
      this.predmet.odseci.length > 0 &&
      this.predmet.fondCasova != null &&
      this.predmet.espb != null 
    )
    {
      this.setterService.azurirajPredmet(this.predmet, this.staraSifraPredmeta).subscribe(
        (res) => {
          alert("Predmet uspesno azuriran!");
          this.staraSifraPredmeta = this.predmet.sifraPredmeta;
        },
        (err) => {
          alert(err);
        }
      );
      

    }
    else
    {
      alert('Morate uneti sva obavezna polja!');



    }


  }

  dodajPredmet()
  {
    if(
      this.noviPredmet.naziv!=null &&
      this.noviPredmet.sifraPredmeta!=null &&
      this.noviPredmet.tip!=null &&
      this.noviPredmet.godina!=null &&
      this.noviPredmet.semestar!=null &&
      this.noviPredmet.odseci!=null &&
      this.noviPredmet.espb!=null &&
      this.noviPredmet.fondCasova!=null
    )
    {
      this.setterService.dodajPredmet(this.noviPredmet).subscribe(
        (res) => {
          if(res['status']===false)
            alert('Predmet sa sifrom poostoji!');
          else
          {
            alert("Predmet uspesno dodat!");
            this.predmeti.push(this.noviPredmet);
            this.noviPredmet = new Predmet();
          }
        },
        (err) => {
          alert(err);
        }
      );

    }

  }

  izbrisiPredmet()
  {
    this.setterService.izbrisiPredmet(this.staraSifraPredmeta).subscribe(
      (res) => {
        alert('Predmet usepesno izbrisan!');
        this.predmet = null;
        if(this.predmetIndex > -1){
          this.predmeti.splice(this.predmetIndex, 1);
          this.predmetIndex = -1;
        }
      },
      (err) => {
        alert(err);
      }
    );


  }

  //PlanAngazovanja


  izaberiPlanAngazovanja($event)
  {
    if($event.target.value > -1 && this.planAngazovanjaIndex != $event.target.value)
    {
      // console.log($event.target.value)
      // console.log(this.korisnici[+$event.target.value])
      this.planAngazovanja = this.planoviAngazovanja[$event.target.value];
      this.planAngazovanjaIndex = $event.target.value;

      if(this.planAngazovanja.grupe.length < 1){
        for(let i = 0; i < this.planAngazovanja.brojGrupa; i++)
          this.planAngazovanja.grupe.push(new Grupa);
      }
        
      // this.staraSifraPredmeta = this.predmet.sifraPredmeta;
    }

  }

  dodajPlanAngazovanja()
  {
    if(
      this.noviPlanAngazovanja.sifraPredmeta != null &&
      this.noviPlanAngazovanja.naziv != null && 
      this.noviPlanAngazovanja.brojGrupa > 0
    )
    {
      this.setterService.dodajPlanAngazovanja(this.noviPlanAngazovanja).subscribe(
        (res) => {
          if(res['status']===false)
            alert('Plan angazovanja za predmet postoji poostoji!');
          else
          {
            alert("Plan angazovanja uspesno dodat!");
            this.planoviAngazovanja.push(this.noviPlanAngazovanja);
            this.noviPlanAngazovanja = new PlanAngazovanja();
          }
        },
        (err) => {
          alert(err);
        }
      );

    }
      
  }

  azurirajPlanAngazovanja()
  {

    for(let grupa of this.planAngazovanja.grupe){
      if(grupa.P.length > 0 && grupa.V.length > 0)
      {
        grupa.P.forEach( elem => { this.planAngazovanjaPredavaci.add(elem); });
        grupa.V.forEach( elem => { this.planAngazovanjaPredavaci.add(elem); });
      }
      else
      {
        alert("Morate izabrati bar jednog profesora za predavanja i vezbe u svakoj grupi!");
        return;
      }
    }


    if(
      this.planAngazovanja.naziv != null 
    )
    {
      console.log(this.planAngazovanjaPredavaci);
      this.setterService.azurirajPlanAngazovanja(this.planAngazovanja, this.planAngazovanjaPredavaci).subscribe(
        (res) => {
          alert('Plan angazovanja uspesno azuriran!');
          this.planAngazovanjaPredavaci.clear();
        },
        (err) => {
          alert(err);
        }
      );

    }
    else
    {
      alert("Morate naziv plana angazovanja!");

    }

  }

  izbrisiPlanAngazovanja()
  {

    this.setterService.izbrisiPlanAngazovanja(this.planAngazovanja.sifraPredmeta).subscribe(
      (res) => {
        alert('Plan angazovanja usepesno izbrisan!');
        this.planAngazovanja = null;
        if(this.planAngazovanjaIndex > -1){
          this.planoviAngazovanja.splice(this.planAngazovanjaIndex, 1);
          this.planAngazovanjaIndex = -1;
        }
      },
      (err) => {
        alert(err);
      }
    );

  }


  //Obavestenja

  izaberiObavestenje($event){

  }


}
