import { FilmI, TMDBFilmoviOdgovor, TMDBOsobaOdgovor, TMDBFilmoviOsobeOdgovor, OsobeIzStraniceI, OsobaOdgovor, OstaleSlikeOdgovor} from "../servisI/tmdbI.js";

export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc: string;

    constructor(apiKljuc: string) {
        this.apiKljuc = apiKljuc;
    }

    public async dohvatiFilm(id:number){
        let resurs = "/movie/"+id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as FilmI;
     }

    public async pretraziFilmovePoNazivu(trazi:string,stranica:number): Promise<TMDBFilmoviOdgovor> {
        let resurs = "/search/movie";
        let parametri = {sort_by: "popularity.desc",
                         include_adult: false,
                         page: stranica,
                         query: trazi};
 
        let odgovor = await this.obaviZahtjev(resurs,parametri);
        return JSON.parse(odgovor) as TMDBFilmoviOdgovor;
     }

     public async dohvatiOsobu(id:number): Promise<OsobaOdgovor> {
        let resurs = "/person/"+id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as OsobaOdgovor;
     }

     public async dohvatiOsobeIzStranice(stranica:number): Promise<OsobeIzStraniceI> {
        let resurs = "/person/popular";
        let parametri = {
            page: stranica
        };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor) as OsobeIzStraniceI;
     }

    public async pretraziOsobePoImenu(trazi:string,stranica:number): Promise<TMDBOsobaOdgovor> {
        let resurs = "/search/person";
        let parametri = {sort_by: "popularity.desc",
                         include_adult: false,
                         page: stranica,
                         query: trazi};
 
        let odgovor = await this.obaviZahtjev(resurs,parametri);
        return JSON.parse(odgovor) as TMDBOsobaOdgovor;
    }

    public async dohvatiFilmoveOdOsobe(id: number): Promise<TMDBFilmoviOsobeOdgovor> {
        let resurs = `/person/${id}/movie_credits`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as TMDBFilmoviOsobeOdgovor;
    }
    
    public async dohvatiOstaleSlikeOdOsobe(id:number): Promise<OstaleSlikeOdgovor> {
        let resurs = `/person/${id}/images`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as OstaleSlikeOdgovor;
     }

    private async obaviZahtjev(resurs:string,parametri:{[kljuc:string]:string|number|boolean}={}){
        let zahtjev = this.bazicniURL+resurs+"?api_key="+this.apiKljuc;
        for(let p in parametri){
            zahtjev+="&"+p+"="+parametri[p];
        }
        console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}