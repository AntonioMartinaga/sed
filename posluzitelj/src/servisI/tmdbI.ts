export interface FilmI {
  jezik: string;
  orginalni_naslov: string;
  naslov: string;
  popularnost: number;
  slikica_postera: string;
  datum_izdavanja: Date;
  opis_filma?: string;
}

export interface OsobaI {
  ime_i_prezime: string;
  poznat_po: string;
  popularnost: number;
  profilna_slika?: string;
}

export interface OsobaOdgovor {
    id: number;
    name: string;
    known_for_department: string;
    popularity: number;
    profile_path?: string;
  }

export interface OsobeIzStraniceI {
    results: { id: number; adult: boolean }[];
    page: number;
    total_pages: number;
    total_results: number;
  }

export interface KastingI {
  film_ID: number;
  osoba_ID: number;
  lik: string;
}

export interface OstaleSlikeI {
  slika: string;
  osoba_ID: number;
}

export interface OstaleSlikeOdgovor {
    id: number;
    profiles: {
        file_path: string;
    }[];
}

export interface KorisnikI {
  korisnicko_ime: string;
}
  
export interface TMDBFilmI {
    original_language: string;
    original_title: string;
    title: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    overview: string;
}

export interface TMDBFilmoviOdgovor {
    results: TMDBFilmI[];
}

export interface TMDBOsobaOdgovor {
    results: OsobaOdgovor[];
}

export interface TMDBFilmoviOsobeOdgovor {
    cast: Array<{
        original_language: string;
        original_title: string;
        title: string;
        popularity: number;
        poster_path: string | null;
        release_date: string | null;
        character: string | null;
        overview: string | null;
    }>;
    crew: Array<{
        original_language: string;
        original_title: string;
        title: string;
        popularity: number;
        poster_path: string | null;
        release_date: string | null;
        job: string | null;
        overview: string | null;
    }>;
}
