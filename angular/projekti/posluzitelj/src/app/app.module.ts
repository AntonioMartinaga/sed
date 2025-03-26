import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

import { RouterModule, Router, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { OsobeComponent } from './osobe/osobe.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { DetaljiComponent } from './detalji/detalji.component';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PrijavaService } from './servisi/prijava.service';

const routes: Routes = [
    { path: 'prijava', component: PrijavaComponent },
    { path: 'registracija', component: RegistracijaComponent },
    { path: '', component: PocetnaComponent, canActivate: [AuthGuard]},
    { path: 'osobe', component: OsobeComponent, canActivate: [AuthGuard] },
    { path: 'korisnici', component: KorisniciComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'detalji/:id', component: DetaljiComponent, canActivate: [AuthGuard] },
    { path: 'dodavanje', component: DodavanjeComponent, canActivate: [AuthGuard, AdminGuard]},
    { path: 'dokumentacija', component: DokumentacijaComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' },
  ];

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    RegistracijaComponent,
    PocetnaComponent,
    OsobeComponent,
    KorisniciComponent,
    DetaljiComponent,
    DodavanjeComponent,
    DokumentacijaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
  ],
  providers: [provideAnimationsAsync(), PrijavaService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
