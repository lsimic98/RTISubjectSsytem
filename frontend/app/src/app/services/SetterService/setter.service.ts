import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Predmet } from 'src/app/model/predmet';

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

  azurirajRedosledPredmeta(
    _id: string,
    sifraPredmeta: string,
    tipMaterijala: string,
    novRedosled: Set<string>
  )
  {
    let data = {
      _id: _id,
      sifraPredmeta: sifraPredmeta,
      tipMaterijala: tipMaterijala,
      novRedosled: Array.from(novRedosled.values())
    };

    return this.httpClient.post(`${this.uri}/updateSubjectFilesOrder`, data);
    
  }


  izbrisiFajl(path: string){
    let data = {
      path : path
    }

    return this.httpClient.post(`${this.uri}/deleteFile`, data);
  }


  azurirajLabInfo(sifraPredmeta: string, labInfo: string, labVidljiv: boolean)
  {
    let data = {
      sifraPredmeta: sifraPredmeta,
      labInfo: labInfo,
      labVidljiv: labVidljiv
    }
    return this.httpClient.post(`${this.uri}/updateSubjectLabInfo`, data);
  }

  azurirajProjekatInfo(sifraPredmeta: string, projekatInfo: string, projekatVidljiv: boolean)
  {
    let data = {
      sifraPredmeta: sifraPredmeta,
      projekatInfo: projekatInfo,
      projekatVidljiv: projekatVidljiv
    }
    return this.httpClient.post(`${this.uri}/updateSubjectProjectInfo`, data);
  }

  azurirajIspitInfo(sifraPredmeta: string, ispitiVidljiv: boolean)
  {
    let data = {
      sifraPredmeta: sifraPredmeta,
      ispitiVidljiv: ispitiVidljiv
    }
    return this.httpClient.post(`${this.uri}/updateSubjectExamInfo`, data);
  }

  azurirajPredmetInfo(predmet: Predmet)
  {
    return this.httpClient.post(`${this.uri}/updateSubjectInfo`, predmet);
  }
}
