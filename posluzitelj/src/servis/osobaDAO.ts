import { OsobaI, KastingI, FilmI, OstaleSlikeI } from "../servisI/tmdbI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class OsobaDAO {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024amartinag22_servis.sqlite");
    }

    async dajSve(): Promise<Array<OsobaI & { id: number }>> {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba;";
        const podaci = await this.baza.dajPodatkePromise(sql, []) as Array<any>;
        let rezultat = new Array<OsobaI & { id: number }>();
    
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
    
    async daj(id: number): Promise<(OsobaI & { id: number }) | null> {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba WHERE id = ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [id]) as Array<any>;
    
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
    
    dodaj(osoba: OsobaI): boolean {
        let sql = `INSERT INTO osoba (ime_i_prezime, poznat_po, popularnost, profilna_slika) 
                   VALUES (?, ?, ?, ?)`;
    
        let podaci: (string | number | null)[] = [
            osoba.ime_i_prezime ?? "",
            osoba.poznat_po ?? "",
            osoba.popularnost ?? 0,
            osoba.profilna_slika ?? "",
        ];
    
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    azuriraj(id: number, osoba: OsobaI): boolean {
        let sql = `UPDATE osoba 
                   SET ime_i_prezime = ?, poznat_po = ?, popularnost = ?, profilna_slika = ?
                   WHERE ID = ?`;
                   
        let podaci: (string | number | null)[] = [
            osoba.ime_i_prezime ?? "",
            osoba.poznat_po ?? "",
            osoba.popularnost ?? 0,
            osoba.profilna_slika ?? "",
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    obrisi(id: number): boolean {
        let sql = "DELETE FROM osoba WHERE ID = ?";
        this.baza.ubaciAzurirajPodatke(sql, [id]);
        return true;
    }

    async obrisiSve(): Promise<boolean>{
        let sql = "DELETE FROM osoba;";
        await this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }

    async obrisiSveKasting(): Promise<boolean>{
        let sql = "DELETE FROM kasting;";
        await this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }

    obrisiKasting(id: number): boolean{
        let sql = "DELETE FROM kasting WHERE film_ID = ?";
        this.baza.ubaciAzurirajPodatke(sql, [id]);
        return true;
    }

    obrisiKastingSve(): boolean{
        let sql = "DELETE FROM kasting";
        this.baza.ubaciAzurirajPodatke(sql, []);
        return true;
    }

    async dodajKasting(podatak: { film_ID: number; osoba_ID: number; lik: string }) {
        const sql = `
            INSERT INTO kasting (film_ID, osoba_ID, lik)
            VALUES (?, ?, ?);
        `;
        await this.baza.ubaciAzurirajPodatke(sql, [podatak.film_ID, podatak.osoba_ID, podatak.lik]);
    }

    async dohvatiFilmoveIKasting(osobaId: number, offset: number): Promise<Array<KastingI & FilmI>> {
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
        return podaci as Array<KastingI & FilmI>;
    }

    async dohvatiOsobe(offset: number): Promise<Array<OsobaI>> {
        let sql = "SELECT id, ime_i_prezime, poznat_po, popularnost, profilna_slika FROM osoba LIMIT 20 OFFSET ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [offset]) as Array<any>;
        let rezultat = new Array<OsobaI & { id: number }>();
    
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

    async dohvatiOstaleSlike(id: number): Promise<Array<OstaleSlikeI>> {
        let sql = "SELECT slika FROM ostale_slike WHERE osoba_ID = ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [id]);
        return podaci as Array<OstaleSlikeI>;
    }

    async dodajOstaleSlike(osoba_ID: number, slika: string ) {
        const sql = "INSERT INTO ostale_slike (slika, osoba_ID) VALUES (?, ?);";
        await this.baza.ubaciAzurirajPodatke(sql, [slika, osoba_ID]);
    }

    async obrisiOstaleSlike(osoba_ID: number) {
        const sql = "DELETE FROM ostale_slike WHERE osoba_ID = ?;";
        await this.baza.ubaciAzurirajPodatke(sql, [osoba_ID]);
    }
}
