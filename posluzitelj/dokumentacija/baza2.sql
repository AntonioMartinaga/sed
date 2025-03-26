BEGIN;
CREATE TABLE "film"(
  "ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "jezik" VARCHAR(45) NOT NULL,
  "orginalni_naslov" VARCHAR(150) NOT NULL,
  "naslov" VARCHAR(150) NOT NULL,
  "popularnost" INTEGER NOT NULL,
  "slikica_postera" VARCHAR(100) NOT NULL,
  "datum_izdavanja" DATE NOT NULL,
  "opis_filma" VARCHAR(250),
  CONSTRAINT "ID_UNIQUE"
    UNIQUE("ID")
);
CREATE TABLE "osoba"(
  "ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime_i_prezime" VARCHAR(100) NOT NULL,
  "poznat_po" VARCHAR(100) NOT NULL,
  "popularnost" INTEGER NOT NULL,
  "profilna_slika" VARCHAR(100),
  CONSTRAINT "ID_UNIQUE"
    UNIQUE("ID")
);
CREATE TABLE "kasting"(
  "film_ID" INTEGER NOT NULL,
  "osoba_ID" INTEGER NOT NULL,
  "lik" VARCHAR(100) NOT NULL,
  PRIMARY KEY("film_ID","osoba_ID"),
  CONSTRAINT "fk_film_has_osoba_film"
    FOREIGN KEY("film_ID")
    REFERENCES "film"("ID"),
  CONSTRAINT "fk_film_has_osoba_osoba1"
    FOREIGN KEY("osoba_ID")
    REFERENCES "osoba"("ID")
);
CREATE INDEX "kasting.fk_film_has_osoba_osoba1_idx" ON "kasting" ("osoba_ID");
CREATE INDEX "kasting.fk_film_has_osoba_film_idx" ON "kasting" ("film_ID");
CREATE TABLE "ostale_slike"(
  "ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "slika" VARCHAR(100) NOT NULL,
  "osoba_ID" INTEGER NOT NULL
);
CREATE TABLE "korisnik"(
  "korisnicko_ime" VARCHAR(50)
);
COMMIT;
