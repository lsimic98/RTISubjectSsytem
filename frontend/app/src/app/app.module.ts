import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RegistracijaStudentComponent } from './registracija-student/registracija-student.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { ZaposleniComponent } from './zaposleni/zaposleni.component';
import { ZaposlenInfoComponent } from './zaposlen-info/zaposlen-info.component';
import { ObavestenjaComponent } from './obavestenja/obavestenja.component';
import { RtiOdsekComponent } from './rti-odsek/rti-odsek.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PrijavaComponent,
    PocetnaComponent,
    RegistracijaStudentComponent,
    KontaktComponent,
    ZaposleniComponent,
    ZaposlenInfoComponent,
    ObavestenjaComponent,
    RtiOdsekComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
