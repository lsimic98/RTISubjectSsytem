import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetterService {

  private uri = 'http://localhost:4000';
  constructor(
    private httpClient: HttpClient
  ) { }


  dohvatiZaposlene()
  {
    return this.httpClient.get(`${this.uri}/getWorkers`);
  }

  dohvatiZaposlenog(idZaposlen: string)
  {
    const data = {
      idZaposlen: idZaposlen
    }
    return this.httpClient.post(`${this.uri}/getWorker`, data);
  }

  dohvatiObavestenje()
  {
    return this.httpClient.get(`${this.uri}/getNotifications`);
  }

  dohvatiPredmetePoOdesku(odesk: string)
  {
    return  this.httpClient.get(`${this.uri}/subjects/${odesk}`);
  }

  dohvatiPredmetPoSifri(sifra: string)
  {
    return this.httpClient.get(`${this.uri}/subject/${sifra}`);
  }

  
  dohvatiPredmetObavestenja(sifra: string)
  {
    return this.httpClient.get(`${this.uri}/subjectNotifications/${sifra}`);
  }
  dohvatiPredmetObavestenjeId(id: string)
  {
    return this.httpClient.get(`${this.uri}/subjectNotification/${id}`);
  }


  dohvatiPlanAngazovanja(idZaposlen: string)
  {
    return this.httpClient.get(`${this.uri}/engagePlan/${idZaposlen}`);
  }


  dohvatiFajloveZaPredmet(sifraPredmeta: string)
  {
    return this.httpClient.get(`${this.uri}/getSubjectFiles/${sifraPredmeta}`);
  }

  dohvatiFajloveZaObavestenjePredmeta()
  {
    
  }

  dohvatiObavestenjaZaPredmete(predmeti: string[])
  {
    let data = {
      predmeti: predmeti
    }

    return this.httpClient.post(`${this.uri}/getSubjectsNotifications`, data);
  }



}
