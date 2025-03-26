import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'RWAZadaca_02';
    korisnik: any = null;
  
    constructor(private router: Router) {
      this.korisnik = JSON.parse(localStorage.getItem('korisnik') || 'null');
    }
  
    odjava() {
      localStorage.removeItem('korisnik');
      this.korisnik = null;
      this.router.navigate(['/prijava']);
    }
  }
