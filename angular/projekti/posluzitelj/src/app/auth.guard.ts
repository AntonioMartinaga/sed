import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const korisnik = localStorage.getItem('korisnik');
    if (korisnik) {
      return true;
    } else {
      this.router.navigate(['/prijava']);
      return false;
    }
  }
}