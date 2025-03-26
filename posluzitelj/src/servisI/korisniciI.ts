export interface TipKorisnikaI {
  naziv: string;
  opis?: string;
}

export interface KorisnikI {
  ime?: string;
  prezime?: string;
  korime: string;
  email: string;
  lozinka: string | null;
  adresa?: string;
  grad?: string;
  postanski_broj?: string;
  pristup?: number;
  zahtjev_za_pristup?: number;
  tip_korisnika_ID: number;
}