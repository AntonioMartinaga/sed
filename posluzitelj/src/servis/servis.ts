import cors from "cors";
import express from "express";
import session from "express-session";
import { dajPortSevis } from "../zajednicko/esmPomocnik.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { RestOsobaTMDB } from "./restTMDB.js";
import { KorisnikUpravitelj } from "./korisnikUpravitelj.js";
import { FetchUpravitelj } from "./fetchUpravitelj.js";

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

let konf = new Konfiguracija();

server.use(
	cors({
		origin: function (origin, povratniPoziv) {
			if (
				!origin ||
				origin.startsWith("http://spider.foi.hr:") ||
				origin.startsWith("http://localhost:")
			) {
				povratniPoziv(null, true);
			} else {
				povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
			}
		},
		optionsSuccessStatus: 200,
	})
);

let port = dajPortSevis("amartinag22");
if (process.argv[3] != undefined) {
	port = process.argv[3];
}

konf
	.ucitajKonfiguraciju()
	.then(pokreniKonfiguraciju)
	.catch((greska: Error | any) => {
		if (process.argv.length == 2)
			console.log("Potrebno je dati naziv datoteke");
		else if (greska.path != undefined)
			console.log("Nije moguće otvoriti datoteku " + greska.path);
		else console.log(greska.message);
		process.exit();
	});

function pokreniKonfiguraciju() {
    server.use("/", express.static("./angular/browser"));

    server.use(session({
        secret: konf.dajKonf().tajniKljucSesija,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    pripremiPutanjeTMDB()
    pripremiPutanjeOdAplikacijskogDijela()
    pripremiPutanjeZaDohvatJWT()
	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		var poruka = { greska: "Nepostojeći resurs" };
		odgovor.send(JSON.stringify(poruka));
	});

	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeTMDB() {
    let restOsobaTMDB = new RestOsobaTMDB(
		konf.dajKonf()["tmdbApiKeyV3"],
		konf.dajKonf()["jwtTajniKljuc"],
	);

    server.get("/servis/app/korisnici", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.post("/servis/app/korisnici", restOsobaTMDB.dodajKorisnika.bind(restOsobaTMDB));
    server.put("/servis/app/korisnici", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/korisnici", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));

    server.get("/servis/app/korisnici/:korime", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.post("/servis/app/korisnici/:korime", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB)); 
    server.put("/servis/app/korisnici/:korime", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/korisnici/:korime", restOsobaTMDB.obrisiKorisnika.bind(restOsobaTMDB));

    server.get("/servis/app/osoba", restOsobaTMDB.dohvatiOsobe.bind(restOsobaTMDB));
    server.post("/servis/app/osoba", restOsobaTMDB.dodajOsobu.bind(restOsobaTMDB));
    server.put("/servis/app/osoba", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/osoba", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));

    server.get("/servis/app/osoba/:id", restOsobaTMDB.dohvatiOsobu.bind(restOsobaTMDB));
    server.post("/servis/app/osoba/:id", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.put("/servis/app/osoba/:id", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/osoba/:id", restOsobaTMDB.obrisiOsobu.bind(restOsobaTMDB));


    server.get("/servis/app/osoba/:id/film", restOsobaTMDB.dohvatiFilmoviOsobe.bind(restOsobaTMDB));
    server.post("/servis/app/osoba/:id/film", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.put("/servis/app/osoba/:id/film", restOsobaTMDB.azurirajFilmoviOsobe.bind(restOsobaTMDB));
    server.delete("/servis/app/osoba/:id/film", restOsobaTMDB.obrisiFilmoviOsobe.bind(restOsobaTMDB));

    server.get("/servis/app/film", restOsobaTMDB.dohvatiFilmovePoDatumu.bind(restOsobaTMDB));
    server.post("/servis/app/film", restOsobaTMDB.dodajFilmovePoDatumu.bind(restOsobaTMDB));
    server.put("/servis/app/film", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/film", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));

    server.get("/servis/app/film/:id", restOsobaTMDB.dohvatiFilm.bind(restOsobaTMDB));
    server.post("/servis/app/film/:id", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.put("/servis/app/film/:id", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/film/:id", restOsobaTMDB.obrisiFilm.bind(restOsobaTMDB));

    // OSTALA PUTANJA
    server.get("/servis/app/osoba/:id/galerija/", restOsobaTMDB.dohvatiOstaleSlikeOdOsobe.bind(restOsobaTMDB));
    server.post("/servis/app/osoba/:id/galerija/", restOsobaTMDB.dodajOstaleSlikeOdOsobe.bind(restOsobaTMDB));
    server.put("/servis/app/osoba/:id/galerija/", restOsobaTMDB.nedostupnaMetoda.bind(restOsobaTMDB));
    server.delete("/servis/app/osoba/:id/galerija/", restOsobaTMDB.obrisiOstaleSlikeOdOsobe.bind(restOsobaTMDB));

    server.post("/servis/app/korisnik/prijava", restOsobaTMDB.prijavaKorisnika.bind(restOsobaTMDB));
    server.post("/servis/app/korisnik/registracija", restOsobaTMDB.registracijaKorisnika.bind(restOsobaTMDB));
}

function pripremiPutanjeOdAplikacijskogDijela() {
	let korisnikUpravitelj = new KorisnikUpravitelj(konf.dajKonf().jwtTajniKljuc, port);

    server.get("/servis/app/korisnik/svi", korisnikUpravitelj.listaKorisnika.bind(korisnikUpravitelj));
    server.put("/servis/app/korisnik/zahtjev", korisnikUpravitelj.azurirajZahtjev.bind(korisnikUpravitelj));
    server.get("/servis/app/korisnik/:korime", korisnikUpravitelj.dohvatiKorisnika.bind(korisnikUpravitelj));
    server.put("/servis/app/korisnik/:korime", korisnikUpravitelj.azurirajKorisnika.bind(korisnikUpravitelj));
    server.get("/servis/app/korisnik", korisnikUpravitelj.dohvatiKorisnikaSesija.bind(korisnikUpravitelj));
}

function pripremiPutanjeZaDohvatJWT(){
let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
  server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
}