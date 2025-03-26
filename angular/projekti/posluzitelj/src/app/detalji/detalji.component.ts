import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OsobeService } from '../servisi/osobe.service';
import { OsobaT, GalerijaT, FilmT } from '../servisi/servisTypes';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-detalji',
  standalone: false,
  templateUrl: './detalji.component.html',
  styleUrls: ['./detalji.component.scss']
})
export class DetaljiComponent implements OnInit {
    slikicaPosteraFilmaPutanja : string = environment.slikicaPosteraFilmaPutanja;
    osoba: OsobaT | null = null;
    galerija: GalerijaT[] = [];
    filmovi: FilmT[] = [];
    currentPage = 1;
    filmsPerPage = 20;
    tooltipElement: HTMLElement | null = null;
  
    constructor(private route: ActivatedRoute, private osobeService: OsobeService, private renderer: Renderer2) { }
  
    async ngOnInit() {
      const osobaID = this.route.snapshot.paramMap.get('id');
      if (osobaID) {
        const osobaIdNumber = +osobaID;
        this.osoba = await this.osobeService.dohvatiOsobu(osobaIdNumber);
  
        await this.osobeService.obrisiGaleriju(osobaIdNumber);
        await this.osobeService.dodajGaleriju(osobaIdNumber);
        this.galerija = await this.osobeService.dohvatiGaleriju(osobaIdNumber);
  
        await this.osobeService.obrisiFilmove(osobaIdNumber);
        await this.osobeService.dodajFilmove(osobaIdNumber);
        await this.ucitajFilmove(osobaIdNumber, this.currentPage);
      }
    }
  
    async ucitajFilmove(osobaID: number, stranica: number) {
      const noviFilmovi = await this.osobeService.dohvatiFilmove(osobaID, stranica);
      this.filmovi = this.filmovi.concat(noviFilmovi);
  
      if (noviFilmovi.length < this.filmsPerPage) {
        document.getElementById("ucitajJosFilmova")?.classList.add("hidden");
      }
    }
  
    async ucitajJosFilmova() {
      this.currentPage++;
      const osobaID = this.route.snapshot.paramMap.get('id');
      if (osobaID) {
        await this.ucitajFilmove(+osobaID, this.currentPage);
      }
    }
  
    formatDatum(timestamp: string): string {
        if (timestamp === '0') {
            return 'Nepoznato';
        }
          
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        };
          
        return date.toLocaleDateString('hr-HR', options);
    }
  
    showTooltip(event: MouseEvent, description: string) {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
  
      const tooltip = this.renderer.createElement('div');
      this.renderer.addClass(tooltip, 'opis');
      this.renderer.setProperty(tooltip, 'textContent', description || 'Opis nije dostupan.');
      this.renderer.appendChild(document.body, tooltip);
  
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.renderer.setStyle(tooltip, 'left', `${rect.left + window.scrollX}px`);
      this.renderer.setStyle(tooltip, 'top', `${rect.bottom + window.scrollY}px`);
  
      this.tooltipElement = tooltip;
    }
  
    hideTooltip() {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
    }
  }