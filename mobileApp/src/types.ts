// Type definitions of the app
export type Jasen = {
    jasen_id: number;
    etunimi: string;
    sukunimi: string;
    jakeluosoite: string;
    postinumero: string;
    postitoimipaikka: string;
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
