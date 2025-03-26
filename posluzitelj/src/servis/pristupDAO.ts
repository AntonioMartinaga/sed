import Baza from "../zajednicko/sqliteBaza.js";

export class PristupDAO {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024amartinag22_servis.sqlite");
    }

    dodajKorisnika(korisnickoIme: string): boolean {
        let sql = `INSERT INTO korisnik (korisnicko_ime) 
                   VALUES (?)`;
    
        let podaci: (string | number | null)[] = [
            korisnickoIme ?? "",
        ];
    
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    obrisiKorisnika(korisnicko_ime: string): boolean {
        let sql = "DELETE FROM korisnik WHERE korisnicko_ime = ?";
        this.baza.ubaciAzurirajPodatke(sql, [korisnicko_ime]);
        return true;
    }
}
