import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private uri = 'http://localhost:4000';


  constructor(
    private httpClient: HttpClient
  ) { }


  registerStudent(
    ime:string,
    prezime:string,
    lozinka:string,
    brojIndeksa:string, 
    tipStudija:string,
    status: string
  )
  {
    const data = {
      ime: ime,
      prezime: prezime,
      lozinka: lozinka,
      brojIndeksa: brojIndeksa,
      tipStudija: tipStudija,
      status: status
    }

    return this.httpClient.post(`${this.uri}/registerStudent`, data);

    
  }


}
