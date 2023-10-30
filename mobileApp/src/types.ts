export type Jasen = {
    jasen_id: number;
    etunimi: string;
    sukunimi: string;
    jakeluosoite: string;
    postinumero: string;
    postitoimipaikka: string;
    tila: string;
};

export type JasenForm = Omit<Jasen, "jasen_id">;

export type Kaato = {
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

export type KaatoForm = Omit<Kaato, "kaato_id">;
