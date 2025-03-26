import Baza from "../zajednicko/sqliteBaza.js";
export class FilmDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024amartinag22_servis.sqlite");
    }
    async dajSve() {
        let sql = "SELECT * FROM film;";
        const podaci = await this.baza.dajPodatkePromise(sql, []);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = {
                jezik: p["jezik"],
                orginalni_naslov: p["orginalni_naslov"],
                naslov: p["naslov"],
                popularnost: p["popularnost"],
                slikica_postera: p["slikica_postera"],
                datum_izdavanja: p["datum_izdavanja"],
                opis_filma: p["opis_filma"] ?? "",
            };
            rezultat.push(k);
        }
        return rezultat;
    }
    async daj(id) {
        const sql = `SELECT id, jezik, orginalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis_filma FROM film WHERE ID = ?;`;
        const podaci = await this.baza.dajPodatkePromise(sql, [id]);
        if (podaci.length === 1 && podaci[0] !== undefined) {
            const p = podaci[0];
            return {
                id: p["ID"],
                jezik: p["jezik"],
                orginalni_naslov: p["orginalni_naslov"],
                naslov: p["naslov"],
                popularnost: p["popularnost"],
                slikica_postera: p["slikica_postera"],
                datum_izdavanja: p["datum_izdavanja"],
                opis_filma: p["opis_filma"] ?? "",
            };
        }
        return null;
    }
    dodaj(film) {
        let sql = `INSERT INTO film (jezik, orginalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis_filma) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const datumIzdavanja = film.datum_izdavanja instanceof Date
            ? film.datum_izdavanja.getTime()
            : null;
        let podaci = [
            film.jezik ?? "",
            film.orginalni_naslov ?? "",
            film.naslov ?? "",
            film.popularnost ?? 0,
            film.slikica_postera ?? "",
            datumIzdavanja,
            film.opis_filma ?? "",
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    azuriraj(id, film) {
        let sql = `UPDATE film 
                   SET jezik = ?, orginalni_naslov = ?, naslov = ?, popularnost = ?, slikica_postera = ?, datum_izdavanja = ?, opis_filma = ? 
                   WHERE ID = ?`;
        let podaci = [
            film.jezik ?? "",
            film.orginalni_naslov ?? "",
            film.naslov ?? "",
            film.popularnost ?? 0,
            film.slikica_postera ?? "",
            film.datum_izdavanja?.toISOString().split("T")[0] ?? "",
            film.opis_filma ?? "",
            id,
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    obrisi(id) {
        let sql = "DELETE FROM film WHERE ID = ?";
        this.baza.ubaciAzurirajPodatke(sql, [id]);
        return true;
    }
    async obrisiSve() {
        let sql = "DELETE FROM film;";
        await this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }
    async dohvatiIdPoNaslovu(orginalni_naslov) {
        const sql = `SELECT ID FROM film WHERE orginalni_naslov = ?`;
        const podaci = (await this.baza.dajPodatkePromise(sql, [orginalni_naslov]));
        if (podaci.length > 0 && podaci[0]?.ID) {
            return podaci[0].ID;
        }
        return null;
    }
    async dohvatiFilmove(offset) {
        let sql = "SELECT id, jezik, orginalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis_filma FROM film LIMIT 20 OFFSET ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [offset]);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = {
                id: p["ID"],
                jezik: p["jezik"],
                orginalni_naslov: p["orginalni_naslov"],
                naslov: p["naslov"],
                popularnost: p["popularnost"],
                slikica_postera: p["slikica_postera"],
                datum_izdavanja: p["datum_izdavanja"],
                opis_filma: p["opis_filma"] ?? "",
            };
            rezultat.push(k);
        }
        return rezultat;
    }
    async dohvatiFilmoveDatum(offset, datumOd, datumDo) {
        let sql = "SELECT * FROM film WHERE datum_izdavanja >= ? AND datum_izdavanja <= ? LIMIT 20 OFFSET ?;";
        var podaci = (await this.baza.dajPodatkePromise(sql, [offset, datumOd, datumDo,]));
        return podaci;
    }
}
