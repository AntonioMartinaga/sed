import { KorisnikI } from "../servisI/korisniciI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class KorisnikDAO {
	private baza: Baza;

	constructor() {
		this.baza = new Baza("podaci/RWA2024amartinag22_web.sqlite");
	}

	async dajSve(): Promise<Array<KorisnikI>> {
		let sql = "SELECT * FROM korisnik;";
		var podaci = (await this.baza.dajPodatkePromise(
			sql,
			[]
		)) as Array<KorisnikI>;
		let rezultat = new Array<KorisnikI>();
		for (let p of podaci) {
			let k: KorisnikI = {
				ime: p["ime"] ?? "",
				prezime: p["prezime"] ?? "",
				korime: p["korime"],
				email: p["email"],
				lozinka: p["lozinka"],
				adresa: p["adresa"] ?? "",
				grad: p["grad"] ?? "",
				postanski_broj: p["postanski_broj"] ?? "",
                pristup: p["pristup"] ?? 0,
                zahtjev_za_pristup: p["zahtjev_za_pristup"] ?? 0,
				tip_korisnika_ID: p["tip_korisnika_ID"]
			};
			rezultat.push(k);
		}
		return rezultat;
	}

	async daj(korime: string): Promise<KorisnikI | null> {
		let sql = "SELECT * FROM korisnik WHERE korime=?;";
		var podaci = (await this.baza.dajPodatkePromise(sql, [
			korime,
		])) as Array<KorisnikI>;

		if (podaci.length == 1 && podaci[0] != undefined) {
			let p = podaci[0];
			let k: KorisnikI = {
				ime: p["ime"] ?? "",
				prezime: p["prezime"] ?? "",
				korime: p["korime"],
				email: p["email"],
				lozinka: p["lozinka"],
				adresa: p["adresa"] ?? "",
				grad: p["grad"] ?? "",
				postanski_broj: p["postanski_broj"] ?? "",
                pristup: p["pristup"] ?? 0,
                zahtjev_za_pristup: p["zahtjev_za_pristup"] ?? 0,
				tip_korisnika_ID: p["tip_korisnika_ID"]
			};
			return k;
		}

		return null;
	}

	dodaj(korisnik: KorisnikI) {
		let sql = `INSERT INTO korisnik (ime,prezime,korime,email,lozinka,adresa,grad,postanski_broj,pristup,zahtjev_za_pristup,tip_korisnika_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
		let podaci = [
			korisnik.ime ?? "",
			korisnik.prezime ?? "",
			korisnik.korime,
			korisnik.email,
			korisnik.lozinka,
			korisnik.adresa ?? "",
			korisnik.grad ?? "",
			korisnik.postanski_broj ?? "",
			0,
			0,
			2,
		];
		this.baza.ubaciAzurirajPodatke(sql, podaci);
		return true;
	}

	obrisi(korime: string) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		this.baza.ubaciAzurirajPodatke(sql, [korime]);
		return true;
	}

	azuriraj(korime: string, korisnik: KorisnikI) {
        let sql = `UPDATE korisnik SET ime=?, prezime=?, email=?, lozinka=?, adresa=?, grad=?, postanski_broj=?, pristup=?, zahtjev_za_pristup=?, tip_korisnika_id=? WHERE korime=?`;
        let podaci = [
            korisnik.ime ?? "",
            korisnik.prezime ?? "",
            korisnik.email ?? "",
            korisnik.lozinka ?? "",
            korisnik.adresa ?? "",
            korisnik.grad ?? "",
            korisnik.postanski_broj ?? "",
            korisnik.pristup ?? "",
            korisnik.zahtjev_za_pristup ?? "",
            korisnik.tip_korisnika_ID ?? "",
            korime
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
}
