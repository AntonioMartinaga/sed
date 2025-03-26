;
import { KorisnikDAO } from "../servis/korisnikDAO.js";
import { kreirajToken } from "../zajednicko/jwt.js";
export class KorisnikUpravitelj {
    tajniKljucJWT;
    korisnikDAO;
    portRest;
    constructor(tajniKljucJWT, portRest) {
        this.tajniKljucJWT = tajniKljucJWT;
        this.korisnikDAO = new KorisnikDAO();
        this.portRest = portRest;
    }
    async listaKorisnika(zahtjev, odgovor) {
        const korisnici = await this.korisnikDAO.dajSve();
        odgovor.json(korisnici);
    }
    async azurirajKorisnika(zahtjev, odgovor) {
        const korime = zahtjev.params["korime"];
        if (!korime) {
            odgovor.status(400).json({ greska: "Korisničko ime nije poslano!" });
            return;
        }
        const korisnik = zahtjev.body;
        if (korisnik.pristup < 0 || korisnik.pristup > 1) {
            odgovor.status(400).json({ greska: "Neispravan status pristupa!" });
            return;
        }
        const sesija = zahtjev.session;
        if (!sesija.korisnik || !sesija.korime) {
            console.log("Preusmjeravanje jer niste prijavljeni.");
            odgovor.redirect("/prijava");
            return;
        }
        let jwt = kreirajToken({ korime: sesija.korime, tip_korisnika_ID: sesija.tip_korisnika_ID }, this.tajniKljucJWT);
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        zaglavlje.set("Authorization", "Bearer " + jwt);
        let podaci = {
            korime: korime,
            tip_korisnika_ID: sesija.tip_korisnika_ID
        };
        let parametri;
        if (korisnik.pristup == 0) {
            parametri = {
                method: 'DELETE',
                body: JSON.stringify(podaci),
                headers: zaglavlje
            };
            const odgovorServis = await fetch("http://localhost:" + this.portRest + "/servis/korisnici/" + korime, parametri);
            if (!odgovorServis.ok) {
                console.error("Pristup zabranjen!");
                odgovor.status(403).json({ status: "error", poruka: "Pristup zabranjen!" });
            }
            else {
                try {
                    this.korisnikDAO.azuriraj(korime, korisnik);
                    odgovor.status(200).json({ status: "success", poruka: "Pristup ažuriran!" });
                }
                catch (err) {
                    console.error("Greška pri ažuriranju korisnika:", err);
                    odgovor.status(400).json({ status: "error", poruka: "Došlo je do greške!" });
                }
            }
        }
        else {
            parametri = {
                method: 'POST',
                body: JSON.stringify(podaci),
                headers: zaglavlje
            };
            const odgovorServis = await fetch("http://localhost:" + this.portRest + "/servis/korisnici", parametri);
            if (!odgovorServis.ok) {
                console.error("Pristup zabranjen!");
                odgovor.status(403).json({ status: "error", poruka: "Pristup zabranjen!" });
            }
            else {
                try {
                    this.korisnikDAO.azuriraj(korime, korisnik);
                    odgovor.status(200).json({ status: "success", poruka: "Pristup ažuriran!" });
                }
                catch (err) {
                    console.error("Greška pri ažuriranju korisnika:", err);
                    odgovor.status(400).json({ status: "error", poruka: "Došlo je do greške!" });
                }
            }
        }
    }
    async dohvatiKorisnika(zahtjev, odgovor) {
        const { korime } = zahtjev.params;
        if (!korime) {
            odgovor.status(400).json({ greska: "Korisničko ime nije poslano!" });
            return;
        }
        try {
            const korisnik = await this.korisnikDAO.daj(korime);
            if (korisnik) {
                odgovor.status(200).json(korisnik);
            }
            else {
                odgovor.status(404).json({ poruka: "Korisnik nije pronađen." });
            }
        }
        catch (error) {
            console.error("Greška prilikom dohvaćanja korisnika:", error);
            odgovor.status(500).json({ poruka: "Došlo je do greške prilikom dohvaćanja korisnika." });
        }
    }
    async dohvatiKorisnikaSesija(zahtjev, odgovor) {
        const sesija = zahtjev.session;
        if (!sesija.korisnik || !sesija.korime) {
            odgovor.status(401).json({ status: "error", poruka: "Niste prijavljeni!" });
            return;
        }
        try {
            const korisnik = await this.korisnikDAO.daj(sesija.korime);
            if (!korisnik) {
                odgovor.status(404).json({ status: "error", poruka: "Korisnik nije pronađen!" });
                return;
            }
            odgovor.status(200).json({
                status: "success",
                korisnik: {
                    ime: korisnik.ime,
                    prezime: korisnik.prezime,
                    korime: korisnik.korime,
                    email: korisnik.email,
                    pristup: korisnik.pristup,
                    zahtjev_za_pristup: korisnik.zahtjev_za_pristup,
                },
            });
        }
        catch (err) {
            console.error("Greška pri dohvaćanju korisničkih podataka:", err);
            odgovor.status(500).json({ status: "error", poruka: "Došlo je do greške." });
        }
    }
    async azurirajZahtjev(zahtjev, odgovor) {
        console.log("Primljeno zahtjev za pristup");
        const sesija = zahtjev.session;
        if (!sesija.korisnik || !sesija.korime) {
            odgovor.status(401).json({ status: "error", poruka: "Niste prijavljeni!" });
            return;
        }
        try {
            const korisnik = await this.korisnikDAO.daj(sesija.korime);
            if (!korisnik) {
                odgovor.status(404).json({ status: "error", poruka: "Korisnik nije pronađen!" });
                return;
            }
            korisnik.zahtjev_za_pristup = 1;
            this.korisnikDAO.azuriraj(sesija.korime, korisnik);
            odgovor.status(200).json({ status: "success", poruka: "Zahtjev za pristup uspješno poslan!" });
        }
        catch (err) {
            console.error("Greška pri slanju zahtjeva:", err);
            odgovor.status(400).json({ status: "error", poruka: "Došlo je do greške." });
        }
    }
}
