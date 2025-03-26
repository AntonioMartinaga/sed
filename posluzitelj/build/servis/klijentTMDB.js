export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async dohvatiFilm(id) {
        let resurs = "/movie/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async pretraziFilmovePoNazivu(trazi, stranica) {
        let resurs = "/search/movie";
        let parametri = { sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async dohvatiOsobu(id) {
        let resurs = "/person/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async dohvatiOsobeIzStranice(stranica) {
        let resurs = "/person/popular";
        let parametri = {
            page: stranica
        };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async pretraziOsobePoImenu(trazi, stranica) {
        let resurs = "/search/person";
        let parametri = { sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async dohvatiFilmoveOdOsobe(id) {
        let resurs = `/person/${id}/movie_credits`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async dohvatiOstaleSlikeOdOsobe(id) {
        let resurs = `/person/${id}/images`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async obaviZahtjev(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}
