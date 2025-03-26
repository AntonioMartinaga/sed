import { Injectable } from '@angular/core';
import { OsobaT, GalerijaT, FilmT } from './servisTypes';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OsobeService {
  url : string = environment.baseURL;
  port : string = environment.port;

  constructor() { }

  private async dohvatiOsobe(stranica: number): Promise<OsobaT[]> {
    const parametri = { method: 'GET' };
    const odgovor = await fetch(this.url + this.port + "/servis/app/osoba?stranica=" + stranica, parametri);
    const podaci = await odgovor.json();
    return podaci;
  }

  public async dohvatiSveOsobe(): Promise<OsobaT[]> {
    let sveOsobe: OsobaT[] = [];
    let stranica = 1;
    while (true) {
      const osobe = await this.dohvatiOsobe(stranica);
      if (osobe.length === 0) {
        break;
      }
      sveOsobe = sveOsobe.concat(osobe);
      stranica++;
    }
    return sveOsobe;
  }

  async dohvatiOsobu(osobaId: number): Promise<OsobaT> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId);
    return response.json();
  }

  async obrisiGaleriju(osobaId: number): Promise<void> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/galerija", { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting gallery');
  }

  async dodajGaleriju(osobaId: number): Promise<void> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/galerija", { method: 'POST' });
    if (!response.ok) throw new Error('Error adding gallery');
  }

  async dohvatiGaleriju(osobaId: number): Promise<GalerijaT[]> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/galerija");
    return response.json();
  }

  async obrisiFilmove(osobaId: number): Promise<void> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/film", { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting films');
  }

  async dodajFilmove(osobaId: number): Promise<void> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/film", { method: 'PUT' });
    if (!response.ok) throw new Error('Error adding films');
  }

  async dohvatiFilmove(osobaId: number, stranica: number): Promise<FilmT[]> {
    const response = await fetch(this.url + this.port + "/servis/app/osoba/" + osobaId + "/film?stranica=" + stranica);
    return response.json();
  }
}