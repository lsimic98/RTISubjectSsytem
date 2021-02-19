import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetterService {

  private uri = 'http://localhost:4000';
  constructor(
    private httpClient: HttpClient
  ) { }



  azurirajKorisnika(data: any){
    return this.httpClient.post(`${this.uri}/updateWorker`, data);
  }

  azurirajObavestenje(data: any)
  {
    return this.httpClient.post(`${this.uri}/updateSubjectNotification`, data);

  }
}
