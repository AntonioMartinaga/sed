import { TMDBklijent } from "./klijentTMDB.js";
import * as jwt from "../zajednicko/jwt.js";
import { OsobaDAO } from "./osobaDAO.js";
import { FilmDAO } from "./filmDAO.js";
import { PristupDAO } from "./pristupDAO.js";
import { KorisnikDAO } from "./korisnikDAO.js";
import * as kodovi from "../zajednicko/kodovi.js";
export class RestOsobaTMDB {
    tmdbKlijent;
    tajniKljucJWT;
    osobaDAO;
    filmDAO;
    pristupDAO;
    korisnikDAO;
    constructor(api_kljuc, tajniKljucJWT) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        this.tajniKljucJWT = tajniKljucJWT;
        this.osobaDAO = new OsobaDAO();
        this.filmDAO = new FilmDAO();
        this.pristupDAO = new PristupDAO();
        this.korisnikDAO = new KorisnikDAO();
    }
    provjeriJWT(zahtjev, odgovor) {
        if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
            //odgovor.status(406).json({ greska: "JWT nije prihvacen!" });
            return true;
        }
        return true;
    }
    provjeriAutorizaciju(zahtjev, odgovor) {
        const token = jwt.dajToken(zahtjev);
        if (token) {
            let jwtTijelo = jwt.dajTijelo(token);
            if (jwtTijelo.tip_korisnika_ID !== 1) {
                odgovor.status(403).json({ status: "error", poruka: "Zabranjen pristup" });
                return false;
            }
        }
        else {
            odgovor.status(406).json({ status: "error", poruka: "Greška s JWT tokenom" });
            return false;
        }
        return true;
    }
    provjeriParametar(zahtjev, odgovor, parametar, tip, vrstaParametra, obavezno = false) {
        let dohvaceniParametar;
        if (tip === "number") {
            dohvaceniParametar = vrstaParametra === "params"
                ? parseInt(zahtjev.params[parametar])
                : parseInt(zahtjev.query[parametar]);
            if (isNaN(dohvaceniParametar) && obavezno) {
                odgovor.status(400).json({ status: "error", poruka: "Očekivani parametar: " + parametar });
                return false;
            }
            if (dohvaceniParametar <= 0 && obavezno) {
                odgovor.status(400).json({ status: "error", poruka: "Dohvaceni parametar '" + parametar + "' je neispravan: '" + dohvaceniParametar + "'" });
                return false;
            }
        }
        else if (tip === "string") {
            dohvaceniParametar = vrstaParametra === "params"
                ? zahtjev.params[parametar]
                : zahtjev.query[parametar];
            if (dohvaceniParametar.trim() === "" && obavezno) {
                odgovor.status(400).json({ status: "error", poruka: "Očekivani parametar: " + parametar });
                return false;
            }
        }
        return true;
    }
    izracunajOffset(stranica, poStranici = 20) {
        return stranica * (poStranici);
    }
    async nedostupnaMetoda(zahtjev, odgovor) {
        odgovor.status(405).json({ status: "error", poruka: "Metoda nije dostupna!" });
    }
    async dodajKorisnika(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriAutorizaciju(zahtjev, odgovor))
            return;
        const podaci = zahtjev.body;
        try {
            this.pristupDAO.dodajKorisnika(podaci.korime);
            odgovor.status(201).json({ status: "success", poruka: "Korisnik dodan!" });
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dodavanju korisnika!" });
        }
    }
    async obrisiKorisnika(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriAutorizaciju(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "korime", "string", "params", true))
            return;
        const podaci = zahtjev.params["korime"];
        try {
            this.pristupDAO.obrisiKorisnika(podaci);
            odgovor.status(201).json({ status: "success", poruka: "Korisnik obrisan!" });
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju korisnika!" });
        }
    }
    async dohvatiOsobu(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            const osobe = await this.osobaDAO.daj(id);
            odgovor.status(200).json(osobe);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju osobe!" });
        }
    }
    async obrisiOsobu(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            this.osobaDAO.obrisi(id);
            odgovor.status(201).json({ status: "success", poruka: "Osoba obrisana!" });
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju osobe!" });
        }
    }
    async dodajOsobu(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", true))
            return;
        const stranica = parseInt(zahtjev.query["stranica"]);
        try {
            const apiOdgovor = await this.tmdbKlijent.dohvatiOsobeIzStranice(stranica);
            if (!apiOdgovor.results || apiOdgovor.results.length === 0) {
                odgovor.status(404).json({ greska: "Nema osoba na zadanoj stranici." });
                return;
            }
            const nasumicanIndex = Math.floor(Math.random() * apiOdgovor.results.length);
            const nasumicnaOsoba = apiOdgovor.results[nasumicanIndex];
            if (!nasumicnaOsoba) {
                odgovor.status(500).json({ greska: "Greška prilikom odabira osobe." });
                return;
            }
            const osobaDetalji = await this.tmdbKlijent.dohvatiOsobu(nasumicnaOsoba.id);
            const novaOsoba = {
                ime_i_prezime: osobaDetalji.name || "",
                poznat_po: osobaDetalji.known_for_department || "",
                popularnost: osobaDetalji.popularity || 0,
                profilna_slika: osobaDetalji.profile_path || ""
            };
            this.osobaDAO.dodaj(novaOsoba);
            odgovor.status(201).json({ status: "success", poruka: "Osoba uspješno dodana u bazu!", osoba: osobaDetalji });
        }
        catch (err) {
            console.error("Greška pri dodavanju osobe:", err);
            odgovor.status(500).json({ status: "error", poruka: "Greška pri dodavanju osobe!" });
        }
    }
    async dohvatiOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", true))
            return;
        const stranica = parseInt(zahtjev.query["stranica"]) - 1;
        const brojOsoba = this.izracunajOffset(stranica, 20);
        try {
            const osobe = await this.osobaDAO.dohvatiOsobe(brojOsoba);
            odgovor.status(200).json(osobe);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju osobe!" });
        }
    }
    async dohvatiFilm(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            const film = await this.filmDAO.daj(id);
            odgovor.status(200).json(film);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju filma!" });
        }
    }
    async dohvatiFilmovePoDatumu(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", false))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "datumOd", "number", "query", false))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "datumDo", "number", "query", false))
            return;
        const stranica = parseInt(zahtjev.query["stranica"]) - 1;
        const brojFilmova = this.izracunajOffset(stranica, 20);
        let brojDatumOd = zahtjev.query["datumOd"];
        let brojDatumDo = zahtjev.query["datumDo"];
        try {
            if (brojDatumOd == undefined || brojDatumDo == undefined || brojDatumOd == null || brojDatumDo == null) {
                const filmovi = await this.filmDAO.dohvatiFilmove(brojFilmova);
                odgovor.status(200).json(filmovi);
            }
            else {
                let datumOd = new Date(Number(brojDatumOd));
                let datumDo = new Date(Number(brojDatumDo));
                brojDatumOd = datumOd.getFullYear() + "-" + String(datumOd.getMonth() + 1).padStart(2, '0') + "-" + String(datumOd.getDate()).padStart(2, '0');
                brojDatumDo = datumDo.getFullYear() + "-" + String(datumDo.getMonth() + 1).padStart(2, '0') + "-" + String(datumDo.getDate()).padStart(2, '0');
                const filmovi = await this.filmDAO.dohvatiFilmoveDatum(brojFilmova, brojDatumOd, brojDatumDo);
                odgovor.status(200).json(filmovi);
            }
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju filmova!" });
        }
    }
    async dodajFilmovePoDatumu(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", false))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "datumOd", "number", "query", false))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "datumDo", "number", "query", false))
            return;
        const podaci = zahtjev.body;
        const datumIzdavanja = podaci.datumIzdavanja ? new Date(podaci.datumIzdavanja) : new Date("1970-01-01");
        const filmZaDodavanje = {
            jezik: podaci.jezik || "",
            orginalni_naslov: podaci.orginalni_naslov || "",
            naslov: podaci.naslov || "",
            popularnost: podaci.popularnost || 0,
            slikica_postera: podaci.slikica_postera || "",
            datum_izdavanja: datumIzdavanja,
            opis_filma: podaci.opis_filma || "",
        };
        try {
            const film = await this.filmDAO.dodaj(filmZaDodavanje);
            odgovor.status(200).json(film);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju filmova!" });
        }
    }
    async obrisiFilm(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            const kasting = this.osobaDAO.obrisiKasting(id);
            if (kasting) {
                try {
                    this.filmDAO.obrisi(id);
                    odgovor.status(201).json({ status: "success", poruka: "Film obrisan!" });
                }
                catch (err) {
                    odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju filma!" });
                }
            }
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju kastinga!" });
        }
    }
    async azurirajFilmoviOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", false))
            return;
        //const stranica = parseInt(zahtjev.query["stranica"] as string) - 1;
        //const brojFilmova = this.izracunajOffset(stranica, 20);
        const osobaId = parseInt(zahtjev.params["id"]);
        try {
            const filmovi = await this.tmdbKlijent.dohvatiFilmoveOdOsobe(osobaId);
            for (const film of filmovi.cast) {
                try {
                    let filmId = await this.filmDAO.dohvatiIdPoNaslovu(film.original_title || "");
                    if (!filmId) {
                        console.log(`Film ne postoji u bazi, dodajem: ${film.original_title}`);
                        const datumIzdavanja = film.release_date ? new Date(film.release_date) : new Date("1970-01-01");
                        const filmZaDodavanje = {
                            jezik: film.original_language || "",
                            orginalni_naslov: film.original_title || "",
                            naslov: film.title || "",
                            popularnost: film.popularity || 0,
                            slikica_postera: film.poster_path || "",
                            datum_izdavanja: datumIzdavanja,
                            opis_filma: film.overview || "",
                        };
                        const uspjeh = this.filmDAO.dodaj(filmZaDodavanje);
                        if (uspjeh) {
                            filmId = await this.filmDAO.dohvatiIdPoNaslovu(film.original_title || "");
                            console.log(`Film dodan u bazu: ${film.original_title}, ID: ${filmId}`);
                        }
                        else {
                            console.error(`Greška: Film nije dodan za naslov: ${film.original_title}`);
                            continue;
                        }
                    }
                    if (!filmId) {
                        console.error(`Greška: ID filma nije pronađen za film: ${film.original_title}`);
                        continue;
                    }
                    const kastingPodaci = {
                        film_ID: filmId,
                        osoba_ID: osobaId,
                        lik: film.character || "Nepoznato",
                    };
                    await this.osobaDAO.dodajKasting(kastingPodaci);
                }
                catch (err) {
                    console.error("Greška pri dodavanju filma:", film, err);
                }
            }
            odgovor.status(201).json({ status: "success", poruka: "Filmovi osobe dodani u bazu!" });
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dodavanju filmova!" });
        }
    }
    async dohvatiFilmoviOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", true))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        const stranica = parseInt(zahtjev.query["stranica"]);
        const brojOsoba = this.izracunajOffset(stranica, 20);
        try {
            const filmovi = await this.osobaDAO.dohvatiFilmoveIKasting(id, brojOsoba);
            odgovor.status(200).json(filmovi);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju filmova!" });
        }
    }
    async obrisiFilmoviOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "stranica", "number", "query", false))
            return;
        //const stranica = parseInt(zahtjev.query["stranica"] as string) - 1;
        //const brojFilmova = this.izracunajOffset(stranica, 20);
        try {
            const kasting = this.osobaDAO.obrisiKastingSve();
            if (kasting) {
                try {
                    this.filmDAO.obrisiSve();
                    odgovor.status(201).json({ status: "success", poruka: "Filmovi obrisani!" });
                }
                catch (err) {
                    odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju filma!" });
                }
            }
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju kastinga!" });
        }
    }
    async dodajOstaleSlikeOdOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            const osoba = await this.osobaDAO.daj(id);
            if (!osoba) {
                odgovor.status(404).json({ status: "error", poruka: "Osoba nije pronađena u bazi!" });
                return;
            }
            const tmdbOdgovor = await this.tmdbKlijent.pretraziOsobePoImenu(osoba.ime_i_prezime, 1);
            if (!tmdbOdgovor.results || tmdbOdgovor.results.length === 0) {
                odgovor.status(404).json({ status: "error", poruka: "Osoba nije pronađena na TMDB-u!" });
                return;
            }
            const tmdbOsoba = tmdbOdgovor.results.find((o) => o.name.toLowerCase() === osoba.ime_i_prezime.toLowerCase());
            if (!tmdbOsoba) {
                odgovor.status(404).json({ status: "error", poruka: "Osoba nije pronađena na TMDB-u!" });
                return;
            }
            const ostaleSlikeOdgovor = await this.tmdbKlijent.dohvatiOstaleSlikeOdOsobe(tmdbOsoba.id);
            if (!ostaleSlikeOdgovor || !ostaleSlikeOdgovor.profiles || !Array.isArray(ostaleSlikeOdgovor.profiles)) {
                odgovor.status(400).json({ status: "error", poruka: "Neispravan format odgovora!" });
                return;
            }
            for (const profile of ostaleSlikeOdgovor.profiles) {
                try {
                    await this.osobaDAO.dodajOstaleSlike(id, profile.file_path);
                }
                catch (err) {
                    console.error(`Greška pri dodavanju slike: ${profile.file_path}`, err);
                }
            }
            odgovor.status(200).json({ status: "success", poruka: "Slike uspješno dodane!" });
        }
        catch (err) {
            console.error("Greška pri dohvaćanju slika:", err);
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju slika!" });
        }
    }
    async dohvatiOstaleSlikeOdOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            const slike = await this.osobaDAO.dohvatiOstaleSlike(id);
            odgovor.status(200).json(slike);
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri dohvaćanju slika!" });
        }
    }
    async obrisiOstaleSlikeOdOsobe(zahtjev, odgovor) {
        if (!this.provjeriJWT(zahtjev, odgovor))
            return;
        if (!this.provjeriParametar(zahtjev, odgovor, "id", "number", "params", true))
            return;
        const id = parseInt(zahtjev.params["id"]);
        try {
            await this.osobaDAO.obrisiOstaleSlike(id);
            odgovor.status(200).json({ status: "success", poruka: "Slike obrisane!" });
        }
        catch (err) {
            odgovor.status(400).json({ status: "error", poruka: "Greška pri brisanju slika!" });
        }
    }
    async prijavaKorisnika(zahtjev, odgovor) {
        const { korime, lozinka } = zahtjev.body;
        if (!korime || !lozinka) {
            odgovor.status(400).json({ poruka: "Korisničko ime i lozinka su obavezni." });
            return;
        }
        try {
            const korisnik = await this.korisnikDAO.daj(korime);
            if (korisnik && korisnik.lozinka === kodovi.kreirajSHA256(lozinka, "moja sol")) {
                if (!zahtjev.session) {
                    throw new Error("Session nije inicijaliziran");
                }
                const sesija = zahtjev.session;
                sesija.korisnik = korisnik;
                sesija.korime = korisnik.korime;
                sesija.tip_korisnika_ID = korisnik.tip_korisnika_ID;
                odgovor.status(200).json({ korisnik });
            }
            else {
                odgovor.status(401).json({ poruka: "Neispravno korisničko ime ili lozinka." });
            }
        }
        catch (error) {
            console.error("Greška prilikom prijave korisnika:", error);
            odgovor.status(500).json({ poruka: "Došlo je do greške prilikom prijave." });
        }
    }
    async registracijaKorisnika(zahtjev, odgovor) {
        const { ime, prezime, korime, email, lozinka, adresa, grad, postanskiBroj } = zahtjev.body;
        if (!korime || !lozinka) {
            odgovor.status(400).json({ poruka: "Korisničko ime i lozinka su obavezni." });
            return;
        }
        try {
            const korisnik = {
                ime,
                prezime,
                korime,
                email,
                lozinka: kodovi.kreirajSHA256(lozinka, "moja sol"),
                adresa,
                grad,
                postanskiBroj,
                tip_korisnika_ID: 2
            };
            await this.korisnikDAO.dodaj(korisnik);
            if (!zahtjev.session) {
                throw new Error("Session nije inicijaliziran");
            }
            const sesija = zahtjev.session;
            sesija.korisnik = korisnik;
            sesija.korime = korisnik.korime;
            sesija.tip_korisnika_ID = korisnik.tip_korisnika_ID;
            odgovor.status(201).json({ korisnik });
        }
        catch (error) {
            console.error("Greška prilikom registracije korisnika:", error);
            odgovor.status(500).json({ poruka: "Došlo je do greške prilikom registracije." });
        }
    }
}
