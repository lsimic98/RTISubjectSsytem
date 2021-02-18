import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Korisnik } from '../model/korisnik';
import { GetterService } from '../services/GetterService/getter.service';
import { SessionService } from '../services/SessionService/session.service';
import { SetterService } from '../services/SetterService/setter.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {

  student: Korisnik;
  username: string;
  role: string;
  message: string;
  isDataLoaded: boolean;


  constructor(
    private sessionService: SessionService,
    private getterService: GetterService,
    private setterService: SetterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.message = null;
    this.username = null;
    this.role = null

    if(this.sessionService.isSetUserSession())
    {
      this.isDataLoaded = false;
      this.username = this.sessionService.getUserSession().korime;
      this.role = this.sessionService.getUserSession().tip;
      if(this.role === 'student')
      {
        this.getterService.dohvatiZaposlenog(this.username).subscribe(
          (student: Korisnik) => {
            if(student)
              this.student = student;
              this.isDataLoaded = true;
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
}
