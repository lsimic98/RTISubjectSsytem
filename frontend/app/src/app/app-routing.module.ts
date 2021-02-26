import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from './administrator/administrator.component';
import { GreskaComponent } from './greska/greska.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { ObavestenjaComponent } from './obavestenja/obavestenja.component';
import { ObavestenjePredmetComponent } from './obavestenje-predmet/obavestenje-predmet.component';
import { OsnovneStudijeComponent } from './osnovne-studije/osnovne-studije.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PredmetInfoComponent } from './predmet-info/predmet-info.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaStudentComponent } from './registracija-student/registracija-student.component';
import { RtiOdsekComponent } from './rti-odsek/rti-odsek.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { UrediPredmetComponent } from './uredi-predmet/uredi-predmet.component';
import { ZaposlenInfoComponent } from './zaposlen-info/zaposlen-info.component';
import { ZaposlenUpdateComponent } from './zaposlen-update/zaposlen-update.component';
import { ZaposleniComponent } from './zaposleni/zaposleni.component';

const routes: Routes = [
  {path:'', component: PocetnaComponent},
  {path:'pocetna', component: PocetnaComponent},
  {path:'zaposleni', component: ZaposleniComponent},
  {path:'obavestenja', component: ObavestenjaComponent},
  {path:'rtiOdsek', component: RtiOdsekComponent},
  {path:'osnovneStudije/:id', component: OsnovneStudijeComponent},
  {path:'zaposlen-info/:id', component: ZaposlenInfoComponent},
  {path:'student-info', component: StudentInfoComponent},
  {path:'predmet-info/:id', component: PredmetInfoComponent},
  {path:'zaposlenUpdate', component: ZaposlenUpdateComponent},
  {path:'prijava', component: PrijavaComponent},
  {path:'kontakt', component: KontaktComponent},
  {path:'registracijaStudent', component: RegistracijaStudentComponent},
  {path:'greska', component: GreskaComponent},
  {path:'uredi-predmet', component: UrediPredmetComponent},
  {path:'admin', component: AdministratorComponent},
  {path:'obavestenje-predmet', component: ObavestenjePredmetComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
