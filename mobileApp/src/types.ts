// Type definitions of the app
export type Jasen = {
    jasen_id: number;
    etunimi: string;
    sukunimi: string;
    jakeluosoite: string;
    postinumero: string;
    postitoimipaikka: string;
    puhelinnumero: string;
    tila: string;
};

export type JasenForm = Partial<Omit<Jasen, "jasen_id">>;

export type Group = {
    ryhma_id: number;
    seurue_id: number;
    ryhman_nimi: string;
};

export type GroupViewQuery = {
    ryhma_id: number;
    ryhman_nimi: string;
    seurue_id: number;
    seurueen_nimi: string;
    jasenia: number;
    osuus_summa: number | null;
};

export type PartyViewQuery = {
    seurue_id: number;
    seurueen_nimi: string;
    jasen_id: number;
    seurueen_johatajan_nimi: string;
    seurue_tyyppi_id: number;
    seurue_tyyppi_nimi: string;
};

export type Shot = {
    kaato_id: number;
    jasen_id: number;
    kaatopaiva: string;
    ruhopaino: number;
    paikka_teksti: string;
    paikka_koordinaatti: string;
    sukupuoli: string;
    ikaluokka: string;
    lisatieto: string;
    elaimen_nimi: string;
};

export type ShotViewQuery = {
    kaato_id: number;
    jasen_id: number;
    kaatajan_nimi: string;
    kaatopaiva: string;
    ruhopaino: number;
    paikka_teksti: string;
    paikka_koordinaatti: string;
    sukupuoli: string;
    ikaluokka: string;
    lisatieto: string;
    elaimen_nimi: string;
};

export type UsageViewQuery = {
    kaato_id: number;
    kaadon_kasittely_id: number;
    kasittelyid: number;
    kasittely_maara: number;
    kasittely_teksti: string;
};

export type ShotFormType = Partial<Omit<Shot, "kaato_id">>;

export type UsageForm = {
    kasittelyid?: number;
    kasittely_maara?: number;
};

export type ShotUsageForm = {
    shot: Partial<ShotFormType>;
    usages: Array<{
        kasittelyid: number | undefined;
        kasittely_maara: number;
    }>;
};

export type FormTypes = ShotUsageForm | JasenForm | undefined;
