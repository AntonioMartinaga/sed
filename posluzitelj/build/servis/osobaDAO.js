import Baza from "../zajednicko/sqliteBaza.js";
export class OsobaDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024amartinag22_servis.sqlite");
    }
    async dajSve() {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba;";
        const podaci = await this.baza.dajPodatkePromise(sql, []);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = {
                id: p["ID"],
                ime_i_prezime: p["ime_i_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                profilna_slika: p["profilna_slika"] ?? "",
            };
            rezultat.push(k);
        }
        return rezultat;
    }
    async daj(id) {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba WHERE id = ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [id]);
        if (podaci.length === 1 && podaci[0] != undefined) {
            let p = podaci[0];
            return {
                id: p["ID"],
                ime_i_prezime: p["ime_i_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                profilna_slika: p["profilna_slika"] ?? "",
            };
        }
        return null;
    }
    dodaj(osoba) {
        let sql = `INSERT INTO osoba (ime_i_prezime, poznat_po, popularnost, profilna_slika) 
                   VALUES (?, ?, ?, ?)`;
        let podaci = [
            osoba.ime_i_prezime ?? "",
            osoba.poznat_po ?? "",
            osoba.popularnost ?? 0,
            osoba.profilna_slika ?? "",
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    azuriraj(id, osoba) {
        let sql = `UPDATE osoba 
                   SET ime_i_prezime = ?, poznat_po = ?, popularnost = ?, profilna_slika = ?
                   WHERE ID = ?`;
        let podaci = [
            osoba.ime_i_prezime ?? "",
            osoba.poznat_po ?? "",
            osoba.popularnost ?? 0,
            osoba.profilna_slika ?? "",
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    obrisi(id) {
        let sql = "DELETE FROM osoba WHERE ID = ?";
        this.baza.ubaciAzurirajPodatke(sql, [id]);
        return true;
    }
    async obrisiSve() {
        let sql = "DELETE FROM osoba;";
        await this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }
    async obrisiSveKasting() {
        let sql = "DELETE FROM kasting;";
        await this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }
    obrisiKasting(id) {
        let sql = "DELETE FROM kasting WHERE film_ID = ?";
        this.baza.ubaciAzurirajPodatke(sql, [id]);
        return true;
    }
    obrisiKastingSve() {
        let sql = "DELETE FROM kasting";
        this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }
    async dodajKasting(podatak) {
        const sql = `
            INSERT INTO kasting (film_ID, osoba_ID, lik)
            VALUES (?, ?, ?);
        `;
        await this.baza.ubaciAzurirajPodatke(sql, [podatak.film_ID, podatak.osoba_ID, podatak.lik]);
    }
    async dohvatiFilmoveIKasting(osobaId, offset) {
        const sql = `
            SELECT 
                k.film_ID,
                k.osoba_ID,
                k.lik,
                f.jezik,
                f.orginalni_naslov,
                f.naslov,
                f.popularnost,
                f.slikica_postera,
                f.datum_izdavanja,
                f.opis_filma
            FROM kasting k
            JOIN film f ON k.film_ID = f.ID
            WHERE k.osoba_ID = ?
            LIMIT 20 OFFSET ?;
        `;
        const podaci = await this.baza.dajPodatkePromise(sql, [osobaId, offset]);
        return podaci;
    }
    async dohvatiOsobe(offset) {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba LIMIT 20 OFFSET ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [offset]);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = {
                id: p["ID"],
                ime_i_prezime: p["ime_i_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                profilna_slika: p["profilna_slika"] ?? "",
            };
            rezultat.push(k);
        }
        return rezultat;
    }
    async dohvatiOstaleSlike(id) {
        let sql = "SELECT slika FROM ostale_slike WHERE osoba_ID = ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [id]);
        return podaci;
    }
    async dodajOstaleSlike(osoba_ID, slika) {
        const sql = "INSERT INTO ostale_slike (slika, osoba_ID) VALUES (?, ?);";
        await this.baza.ubaciAzurirajPodatke(sql, [slika, osoba_ID]);
    }
    async obrisiOstaleSlike(osoba_ID) {
        const sql = "DELETE FROM ostale_slike WHERE osoba_ID = ?;";
        await this.baza.ubaciAzurirajPodatke(sql, [osoba_ID]);
    }
}
