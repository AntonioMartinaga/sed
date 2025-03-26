import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PrijavaService } from '../servisi/prijava.service';

@Component({
  selector: 'app-registracija',
  standalone: false,
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss']
})
export class RegistracijaComponent {
    errorPoruka = '';
  
    constructor(private router: Router, private prijavaService: PrijavaService) { }
  
    async onSubmit(registracijaForm: NgForm) {
      const { ime, prezime, korime, email, lozinka, adresa, grad, postanskiBroj } = registracijaForm.value;
  
      if (!korime || !lozinka) {
        this.errorPoruka = 'Korisničko ime i lozinka su obavezni.';
        return;
      }
  
      try {
        const response = await this.prijavaService.registracija({
          ime, prezime, korime, email, lozinka, adresa, grad, postanskiBroj
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Uspješna registracija", data);
          localStorage.setItem('korisnik', JSON.stringify(data.korisnik));
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        } else {
          const errorData = await response.json();
          this.errorPoruka = errorData.poruka || 'Došlo je do greške prilikom registracije.';
        }
      } catch (error) {
        console.error("Greška prilikom registracije", error);
        this.errorPoruka = 'Došlo je do greške prilikom registracije.';
      }
    }
  }