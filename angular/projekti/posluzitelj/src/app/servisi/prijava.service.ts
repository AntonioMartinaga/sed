import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { KorisnikT } from './servisTypes';

@Injectable({
  providedIn: 'root'
})
export class PrijavaService {
  url: string = `${environment.baseURL}${environment.port}/servis/app/korisnik/`;
  korisnik: KorisnikT | null = null;

  constructor() { }

  async prijava(korime: string, lozinka: string): Promise<any> {
    const response = await fetch(`${this.url}prijava`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ korime, lozinka })
    });

    if (!response.ok) {
      throw new Error('Neispravno korisničko ime ili lozinka.');
    }

    const data = await response.json();
    return data;
  }

  async registracija(podaci: any) {
    const response = await fetch(this.url + "registracija", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(podaci)
    });
    return response;
  }

  async dohvatiKorisnika(korime: string) {
    const response = await fetch(this.url + korime, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
}