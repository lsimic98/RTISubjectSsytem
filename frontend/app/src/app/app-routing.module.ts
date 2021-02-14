import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KontaktComponent } from './kontakt/kontakt.component';
import { ObavestenjaComponent } from './obavestenja/obavestenja.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaStudentComponent } from './registracija-student/registracija-student.component';
import { RtiOdsekComponent } from './rti-odsek/rti-odsek.component';
import { ZaposlenInfoComponent } from './zaposlen-info/zaposlen-info.component';
import { ZaposleniComponent } from './zaposleni/zaposleni.component';

const routes: Routes = [
  {path:'', component: PocetnaComponent},
  {path:'pocetna', component: PocetnaComponent},
  {path:'zaposleni', component: ZaposleniComponent},
  {path:'obavestenja', component: ObavestenjaComponent},
  {path:'rtiOdsek', component: RtiOdsekComponent},
  {path:'zaposlen-info/:id', component: ZaposlenInfoComponent},
  {path:'prijava', component: PrijavaComponent},
  {path:'kontakt', component: KontaktComponent},
  {path:'registracijaStudent', component: RegistracijaStudentComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
