export type FilmT = {
    jezik: string;
    orginalni_naslov: string;
    naslov: string;
    popularnost: number;
    slikica_postera: string;
    datum_izdavanja: string;
    opis_filma: string;
    lik: string;
};

export type OsobaT = {
	id: number;
	ime_i_prezime: string;
	poznat_po: string;
	popularnost: number;
	profilna_slika: string;
};

export type GalerijaT = {
	id: number;
	slika: string;
	osoba_id: number;
};

export type KorisnikPravaT = {
	korime: string;
};

export type TipKorisnikaI = {
    naziv: string;
    opis?: string;
}
  
export type KorisnikT = {
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
