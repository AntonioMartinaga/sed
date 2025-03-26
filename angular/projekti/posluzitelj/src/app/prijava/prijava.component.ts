import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PrijavaService } from '../servisi/prijava.service';

@Component({
  selector: 'app-prijava',
  standalone: false,
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})

export class PrijavaComponent {
    showLoginInfo = false;
    errorPoruka = '';
  
    constructor(private router: Router, private prijavaService: PrijavaService) { }
  
    toggleLoginInfo() {
      this.showLoginInfo = !this.showLoginInfo;
    }
  
    async onSubmit(formaZaPrijavu: NgForm) {
      const { korime, lozinka } = formaZaPrijavu.value;
  
      try {
        const response = await this.prijavaService.prijava(korime, lozinka);
        console.log("Uspješna prijava", response);
        localStorage.setItem('korisnik', JSON.stringify(response.korisnik));
        this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
      } catch (error) {
        console.error("Greška prilikom prijave", error);
        this.errorPoruka = 'Neispravno korisničko ime ili lozinka.';
      }
    }
  }