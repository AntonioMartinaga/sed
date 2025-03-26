import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrijavaService } from '../servisi/prijava.service';

@Component({
  selector: 'app-pocetna',
  standalone: false,
  
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss'
})

export class PocetnaComponent implements OnInit {

    korisnik: any = null;

    constructor(private prijavaService: PrijavaService) { }
  
    async ngOnInit() {
      const korisnik = JSON.parse(localStorage.getItem('korisnik') || 'null');
      if (korisnik) {
        this.korisnik = await this.prijavaService.dohvatiKorisnika(korisnik.korime);
      }
    }
}