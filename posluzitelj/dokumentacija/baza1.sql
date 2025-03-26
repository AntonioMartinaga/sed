BEGIN;
CREATE TABLE "tip_korisnika"(
  "ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "korisnik"(
  "ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "korime" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "adresa" VARCHAR(50),
  "grad" VARCHAR(50),
  "postanski_broj" VARCHAR(20),
  "pristup" INTEGER,
  "zahtjev_za_pristup" INTEGER,
  "tip_korisnika_ID" INTEGER NOT NULL,
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_ID")
    REFERENCES "tip_korisnika"("ID")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_ID");
COMMIT;

INSERT INTO "tip_korisnika" ("ID", "naziv", "opis") VALUES (1, 'administrator', 'administrator sustava');
INSERT INTO "tip_korisnika" ("ID", "naziv", "opis") VALUES (2, 'registrirani korisnik', 'registrirani korisnik sustava');

