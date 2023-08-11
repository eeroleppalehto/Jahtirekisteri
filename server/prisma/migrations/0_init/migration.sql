-- CreateTable
CREATE TABLE "aikuinenvasa" (
    "ikaluokka" VARCHAR(20) NOT NULL,

    CONSTRAINT "aikuinenvasa_pk" PRIMARY KEY ("ikaluokka")
);

-- CreateTable
CREATE TABLE "elain" (
    "elaimen_nimi" VARCHAR(20) NOT NULL,

    CONSTRAINT "elain_pk" PRIMARY KEY ("elaimen_nimi")
);

-- CreateTable
CREATE TABLE "jakoryhma" (
    "ryhma_id" SERIAL NOT NULL,
    "seurue_id" INTEGER NOT NULL,
    "ryhman_nimi" VARCHAR(50) NOT NULL,

    CONSTRAINT "jakoryhma_pk" PRIMARY KEY ("ryhma_id")
);

-- CreateTable
CREATE TABLE "jakotapahtuma" (
    "tapahtuma_id" SERIAL NOT NULL,
    "paiva" DATE NOT NULL,
    "ryhma_id" INTEGER NOT NULL,
    "osnimitys" VARCHAR(20) NOT NULL,
    "kaadon_kasittely_id" INTEGER NOT NULL,
    "maara" REAL NOT NULL,

    CONSTRAINT "jakotapahtuma_pk" PRIMARY KEY ("tapahtuma_id")
);

-- CreateTable
CREATE TABLE "jasen" (
    "jasen_id" SERIAL NOT NULL,
    "etunimi" VARCHAR(50) NOT NULL,
    "sukunimi" VARCHAR(50) NOT NULL,
    "jakeluosoite" VARCHAR(30) NOT NULL,
    "postinumero" VARCHAR(10) NOT NULL,
    "postitoimipaikka" VARCHAR(30) NOT NULL,
    "tila" VARCHAR(20) DEFAULT 'aktiivinen',

    CONSTRAINT "jasen_pk" PRIMARY KEY ("jasen_id")
);

-- CreateTable
CREATE TABLE "jasenyys" (
    "jasenyys_id" SERIAL NOT NULL,
    "ryhma_id" INTEGER NOT NULL,
    "jasen_id" INTEGER NOT NULL,
    "osuus" INTEGER NOT NULL,
    "liittyi" DATE NOT NULL,
    "poistui" DATE,

    CONSTRAINT "jasenyys_pk" PRIMARY KEY ("jasenyys_id")
);

-- CreateTable
CREATE TABLE "kaadon_kasittely" (
    "kaadon_kasittely_id" SERIAL NOT NULL,
    "kasittelyid" INTEGER NOT NULL,
    "kaato_id" INTEGER NOT NULL,
    "kasittely_maara" INTEGER NOT NULL,

    CONSTRAINT "kaadon_kasittely_pk" PRIMARY KEY ("kaadon_kasittely_id")
);

-- CreateTable
CREATE TABLE "kaato" (
    "kaato_id" SERIAL NOT NULL,
    "jasen_id" INTEGER NOT NULL,
    "kaatopaiva" DATE NOT NULL,
    "ruhopaino" REAL NOT NULL,
    "paikka_teksti" VARCHAR(100) NOT NULL,
    "paikka_koordinaatti" VARCHAR(100),
    "elaimen_nimi" VARCHAR(20) NOT NULL,
    "sukupuoli" VARCHAR(20) NOT NULL,
    "ikaluokka" VARCHAR(20) NOT NULL,
    "lisatieto" VARCHAR(255),

    CONSTRAINT "kaato_pk" PRIMARY KEY ("kaato_id")
);

-- CreateTable
CREATE TABLE "kasittely" (
    "kasittelyid" SERIAL NOT NULL,
    "kasittely_teksti" VARCHAR(50) NOT NULL,

    CONSTRAINT "kasittely_pk" PRIMARY KEY ("kasittelyid")
);

-- CreateTable
CREATE TABLE "lupa" (
    "luparivi_id" SERIAL NOT NULL,
    "seura_id" INTEGER NOT NULL,
    "lupavuosi" VARCHAR(4) NOT NULL,
    "elaimen_nimi" VARCHAR(20) NOT NULL,
    "sukupuoli" VARCHAR(20) NOT NULL,
    "ikaluokka" VARCHAR(20) NOT NULL,
    "maara" INTEGER NOT NULL,

    CONSTRAINT "lupa_pk" PRIMARY KEY ("luparivi_id")
);

-- CreateTable
CREATE TABLE "ruhonosa" (
    "osnimitys" VARCHAR(20) NOT NULL,

    CONSTRAINT "ruhonosa_pk" PRIMARY KEY ("osnimitys")
);

-- CreateTable
CREATE TABLE "seura" (
    "seura_id" SERIAL NOT NULL,
    "seuran_nimi" VARCHAR(50) NOT NULL,
    "jakeluosoite" VARCHAR(30) NOT NULL,
    "postinumero" VARCHAR(10) NOT NULL,
    "postitoimipaikka" VARCHAR(30) NOT NULL,

    CONSTRAINT "seura_pk" PRIMARY KEY ("seura_id")
);

-- CreateTable
CREATE TABLE "seurue" (
    "seurue_id" SERIAL NOT NULL,
    "seura_id" INTEGER NOT NULL,
    "seurueen_nimi" VARCHAR(50) NOT NULL,
    "jasen_id" INTEGER NOT NULL,

    CONSTRAINT "seurue_pk" PRIMARY KEY ("seurue_id")
);

-- CreateTable
CREATE TABLE "sukupuoli" (
    "sukupuoli" VARCHAR(20) NOT NULL,

    CONSTRAINT "sukupuoli_pk" PRIMARY KEY ("sukupuoli")
);

-- AddForeignKey
ALTER TABLE "jakoryhma" ADD CONSTRAINT "seurue_ryhma_fk" FOREIGN KEY ("seurue_id") REFERENCES "seurue"("seurue_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jakotapahtuma" ADD CONSTRAINT "kaadon_kasittely_jakotapahtuma_fk" FOREIGN KEY ("kaadon_kasittely_id") REFERENCES "kaadon_kasittely"("kaadon_kasittely_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jakotapahtuma" ADD CONSTRAINT "ruhonosa_jakotapahtuma_fk" FOREIGN KEY ("osnimitys") REFERENCES "ruhonosa"("osnimitys") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jakotapahtuma" ADD CONSTRAINT "ryhma_jakotapahtuma_fk" FOREIGN KEY ("ryhma_id") REFERENCES "jakoryhma"("ryhma_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jasenyys" ADD CONSTRAINT "jasen_jasenyys_fk" FOREIGN KEY ("jasen_id") REFERENCES "jasen"("jasen_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jasenyys" ADD CONSTRAINT "ryhma_jasenyys_fk" FOREIGN KEY ("ryhma_id") REFERENCES "jakoryhma"("ryhma_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaadon_kasittely" ADD CONSTRAINT "kaato_kaadon_kasittely_fk" FOREIGN KEY ("kaato_id") REFERENCES "kaato"("kaato_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaadon_kasittely" ADD CONSTRAINT "kasittely_kaadon_kasittely_fk" FOREIGN KEY ("kasittelyid") REFERENCES "kasittely"("kasittelyid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaato" ADD CONSTRAINT "aikuinen_vasa_kaato_fk" FOREIGN KEY ("ikaluokka") REFERENCES "aikuinenvasa"("ikaluokka") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaato" ADD CONSTRAINT "elain_kaato_fk" FOREIGN KEY ("elaimen_nimi") REFERENCES "elain"("elaimen_nimi") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaato" ADD CONSTRAINT "jasen_kaato_fk" FOREIGN KEY ("jasen_id") REFERENCES "jasen"("jasen_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kaato" ADD CONSTRAINT "sukupuoli_kaato_fk" FOREIGN KEY ("sukupuoli") REFERENCES "sukupuoli"("sukupuoli") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lupa" ADD CONSTRAINT "aikuinen_vasa_lupa_fk" FOREIGN KEY ("ikaluokka") REFERENCES "aikuinenvasa"("ikaluokka") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lupa" ADD CONSTRAINT "elain_lupa_fk" FOREIGN KEY ("elaimen_nimi") REFERENCES "elain"("elaimen_nimi") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lupa" ADD CONSTRAINT "seura_lupa_fk" FOREIGN KEY ("seura_id") REFERENCES "seura"("seura_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lupa" ADD CONSTRAINT "sukupuoli_lupa_fk" FOREIGN KEY ("sukupuoli") REFERENCES "sukupuoli"("sukupuoli") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seurue" ADD CONSTRAINT "jasen_seurue_fk" FOREIGN KEY ("jasen_id") REFERENCES "jasen"("jasen_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seurue" ADD CONSTRAINT "seura_seurue_fk" FOREIGN KEY ("seura_id") REFERENCES "seura"("seura_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

