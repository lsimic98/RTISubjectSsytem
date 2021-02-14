import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../services/RegisterService/register.service';

@Component({
  selector: 'app-registracija-student',
  templateUrl: './registracija-student.component.html',
  styleUrls: ['./registracija-student.component.css']
})
export class RegistracijaStudentComponent implements OnInit {

  ime: string;
  prezime: string;
  lozinka: string;
  lozinka2: string;
  brojIndeksa: string;
  tipStudija: string;
  errorMessage: string;
  brojIndeksaRegex: any;

  constructor(
    private _registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorMessage = null;
    this.brojIndeksaRegex = new RegExp('^[1-2][0-9]{3}[/][0-9]{4}$');
    this.tipStudija = "d";
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
            this.ime, this.prezime, this.lozinka, this.brojIndeksa, this.tipStudija
          ).subscribe((res) => {
            if(res['status']===false)
              this.errorMessage='Korisnik sa ovim brojem indeksa vec postoji';
            else  
              this.router.navigate(['/prijava']);
          });

        }
        else
        {
          this.errorMessage = "Lozinka i ponovljena lozinka moraju biti iste!";
        }
      }
      else
      {
        this.errorMessage = "Broj indeksa mora biti u foramtu GGGG/BBBB !";
      }
    }
    else{
      this.errorMessage = "Morate uneti sva polja!";
    }

  }

}
