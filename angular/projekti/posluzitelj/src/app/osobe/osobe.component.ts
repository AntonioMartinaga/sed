import { Component, OnInit } from '@angular/core';
import { OsobeService } from '../servisi/osobe.service';
import { OsobaT } from '../servisi/servisTypes';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-osobe',
  standalone: false,
  templateUrl: './osobe.component.html',
  styleUrls: ['./osobe.component.scss']
})
export class OsobeComponent implements OnInit {
    profilnaSlikaOsobePutanja : string = environment.profilnaSlikaOsobePutanja;
    osobe: OsobaT[] = [];
    stranica = 1;
    poStranici = 10;
    ukupnoStranica = 0;
  
    constructor(private osobeService: OsobeService, private router: Router) { }
  
    async ngOnInit() {
      this.osobe = await this.osobeService.dohvatiSveOsobe();
      this.ukupnoStranica = Math.ceil(this.osobe.length / this.poStranici);
      this.prikaziOsobe();
    }
  
    prikaziOsobe() {
      const startIndex = (this.stranica - 1) * this.poStranici;
      const endIndex = startIndex + this.poStranici;
      return this.osobe.slice(startIndex, endIndex);
    }
  
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    pregledDetaljaOsobe(osobaID: number) {
        this.router.navigate(['/detalji', osobaID]);
    }
  
    postaviPoStranici(event: Event) {
      const target = event.target as HTMLSelectElement;
      const novaVrijednost = parseInt(target.value, 10);
      this.poStranici = novaVrijednost;
      this.ukupnoStranica = Math.ceil(this.osobe.length / this.poStranici);
      this.stranica = 1;
      this.prikaziOsobe();
      this.scrollToTop();
    }
  
    preusmjeriNaStranicu(novaStranica: number) {
      if (novaStranica < 1) {
        this.stranica = 1;
      } else if (novaStranica > this.ukupnoStranica) {
        this.stranica = this.ukupnoStranica;
      } else {
        this.stranica = novaStranica;
      }
      this.prikaziOsobe();
      this.scrollToTop();
    }
  
    prvaStranica() {
      this.stranica = 1;
      this.prikaziOsobe();
      this.scrollToTop();
    }
  
    zadnjaStranica() {
      this.stranica = this.ukupnoStranica;
      this.prikaziOsobe();
      this.scrollToTop();
    }
  }