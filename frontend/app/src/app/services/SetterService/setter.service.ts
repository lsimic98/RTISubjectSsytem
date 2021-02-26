import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from 'src/app/model/korisnik';
import { Obavestenje } from 'src/app/model/obavestenje';
import { ObavestenjePredmet } from 'src/app/model/obavestenjePredmet';
import { PlanAngazovanja } from 'src/app/model/planAngazovanja';
import { Predmet } from 'src/app/model/predmet';
import { Spisak } from 'src/app/model/spisak';

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


  dodajObavestenjaBezFajlova(obavestenje: ObavestenjePredmet)
  {
    return this.httpClient.post(`${this.uri}/uploadSubjectNotification`, obavestenje);
  }

  dodajObavestenjaSaFajlovima(obavestenje: ObavestenjePredmet, files: File[], korime: string, ime: string, prezime: string)
  {
    const formData = new FormData();
    for(let file of files){
      formData.append('files', file);
    }


    return this.httpClient.post(`${this.uri}/uploadSubjectNotificationWithFiles`, formData,
    {
      headers: { 
        'subfolder': 'obavestenjaPredmeta/' + obavestenje.folder,
        'korime': korime,
        'ime': ime,
        'prezime': prezime,
        'sifraPredmeta': obavestenje.sifraPredmeta,
        'naslov': obavestenje.naslov,
        'sadrzaj': obavestenje.sadrzaj,
        'datumObjave': obavestenje.datumObjave.toISOString(),
        'folder': obavestenje.folder
      }}
    );
  }


  izbrisiObavestenjePredmeta(folder: string)
  {
    return this.httpClient.post(`${this.uri}/deleteSubjectNotification`, {folder: folder});
  }

  azurirajObavestenjePredmeta(obavestenjePredmeta: ObavestenjePredmet)
  {
    return this.httpClient.post(`${this.uri}/updateSubjectNotification`, obavestenjePredmeta);
  }

  napraviNoviSpisak(noviSpisak: Spisak)
  {
    return this.httpClient.post(`${this.uri}/uploadSubjectList`, noviSpisak);
  }

  azurirajSpisak(spisak: Spisak)
  {
    return this.httpClient.post(`${this.uri}/updateSubjectList`, spisak);

  }



  izbrisiSpisak(folder: string)
  {
    return this.httpClient.post(`${this.uri}/deleteSubjectList`, {folder: folder});
  }


  izbrisiStudenta(korime: string)
  {
    return this.httpClient.post(`${this.uri}/deleteStudentAdmin`, {korime: korime});
  }

  azurirajStudenta(student: Korisnik, staroKorime: string)
  {
    const data = {
       ime: student.ime,
       prezime: student.prezime,
       tipStudija: student.tipStudija,
       lozinka: student.lozinka,
       brojIndeksa: student.brojIndeksa,
       status: student.status,
       staroKorime: staroKorime
    }
    
    return this.httpClient.post(`${this.uri}/updateStudentAdmin`, data);

  }



  dodajZaposlenog(zaposlen: Korisnik)
  {
    return this.httpClient.post(`${this.uri}/registerWorkerAdmin`, zaposlen);
  }

  azurirajZaposlenog(zaposlen: Korisnik, staroKorime: string)
  {
    const data = {
      korime: zaposlen.korime,
      lozinka: zaposlen.lozinka,
      ime: zaposlen.ime,
      prezime: zaposlen.prezime,
      adresa: zaposlen.adresa,
      kontakt: zaposlen.kontakt,
      webAdresa: zaposlen.webAdresa,
      biografija: zaposlen.biografija,
      zvanje: zaposlen.zvanje,
      brojKabineta: zaposlen.brojKabineta,
      staroKorime: staroKorime
    };

    return this.httpClient.post(`${this.uri}/updateWorkerAdmin`, data);

  }

  izbrisiZaposlenog(korime: string)
  {
    return this.httpClient.post(`${this.uri}/deleteWorkerAdmin`, {korime: korime});

  }


  dodajPredmet(predmet: Predmet)
  {
    return this.httpClient.post(`${this.uri}/registerSubjectAdmin`, predmet);
  }

  azurirajPredmet(predmet: Predmet, staraSifraPredmeta: string)
  {
    const data = {
      naziv: predmet.naziv,
      sifraPredmeta: predmet.sifraPredmeta,
      tip: predmet.tip,
      godina: predmet.godina,
      semestar: predmet.semestar,
      odseci: predmet.odseci,
      fondCasova: predmet.fondCasova,
      espb: predmet.espb,
      cilj: predmet.cilj,
      ishod: predmet.ishod,
      termini: predmet.termini,
      dodatneInformacije: predmet.dodatneInformacije,
      labInfo: predmet.labInfo,
      projekatInfo: predmet.projekatInfo,
      ispitiVidljiv: predmet.ispitiVidljiv,
      labVidljiv: predmet.labVidljiv,
      projekatVidljiv: predmet.projekatVidljiv,
      predavaci: predmet.predavaci,
      ispiti: predmet.ispiti,
      lab: predmet.lab,
      predavanja: predmet.predavanja,
      projekat: predmet.projekat,
      vezbe: predmet.vezbe,
      staraSifraPredmeta: staraSifraPredmeta
    }

    return this.httpClient.post(`${this.uri}/updateSubjectAdmin`, predmet);

  }

  izbrisiPredmet(sifraPredmeta: string)
  {
    return this.httpClient.post(`${this.uri}/deleteSubjectAdmin`, {sifraPredmeta: sifraPredmeta});
  }


  dodajPlanAngazovanja(planAngazovanja: PlanAngazovanja)
  {
    return this.httpClient.post(`${this.uri}/registerEngagePlanAdmin`, planAngazovanja);
  }

  azurirajPlanAngazovanja(planAngazovanja: PlanAngazovanja, predavaci: Set<string>)
  {
    const data = {
      naziv: planAngazovanja.naziv,
      predavaci: Array.from(predavaci),
      studenti: planAngazovanja.studenti,
      grupe: planAngazovanja.grupe,
      sifraPredmeta: planAngazovanja.sifraPredmeta
    }
    return this.httpClient.post(`${this.uri}/updateEngagePlanAdmin`, data);

  }

  izbrisiPlanAngazovanja(sifraPredmeta: string)
  {
    
    return this.httpClient.post(`${this.uri}/deleteEngagePlanAdmin`, {sifraPredmeta: sifraPredmeta});
  }


  dodajObavestenje(obavestenje: Obavestenje)
  {
    return this.httpClient.post(`${this.uri}/registerNotificationAdmin`, obavestenje);
  }

  azurirajObavestenjeAdmin(obavestenje: Obavestenje)
  {
    return this.httpClient.post(`${this.uri}/updateNotificationAdmin`, obavestenje);

  }
  
  izbrisiObavestenje(obavestenje: Obavestenje)
  {
    return this.httpClient.post(`${this.uri}/deleteNotificationAdmin`, {_id: obavestenje._id});

  }


  prijavaNaSpisakFajl(spisak: Spisak, file: File, korime: string, ime: string, prezime: string)
  {
    const formData = new FormData();
    formData.append('file', file);

    alert(spisak);
    


    return this.httpClient.post(`${this.uri}/registerOnSubjectListFile`, formData,
    {
      headers: { 
        'subfolder': 'spiskovi/' + spisak.folder,
        'korime': korime,
        'ime': ime,
        'prezime': prezime,
        'sifraPredmeta': spisak.sifraPredmeta,
        'folder': spisak.folder,
        '_id': spisak._id
      }}
    );
  }


  prijavaNaSpisak(spisak: Spisak, korime: string)
  {
    
    return this.httpClient.post(`${this.uri}/registerOnSubjectList`, {korime: korime, _id:spisak._id});


  }



  



}
