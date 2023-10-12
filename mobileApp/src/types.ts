export interface Jasen {
    jasen_id: number;
    etunimi: string;
    sukunimi: string;
    jakeluosoite: string;
    postinumero: string;
    postitoimipaikka: string;
    tila: string;
};

export type JasenForm = Omit<Jasen, 'jasen_id'>;