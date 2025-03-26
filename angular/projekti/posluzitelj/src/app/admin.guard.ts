import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const korisnik = JSON.parse(localStorage.getItem('korisnik') || '{}');
    if (korisnik && korisnik.pristup === 1) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}