import { Prisma } from "@prisma/client";
import { z } from "zod";

const validateTila = (tila: string): boolean => {
    if (tila === "aktiivinen" || tila === "poistunut") {
        return true;
    } else {
        return false;
    }
};

export const jasenInput = z.object({
    etunimi: z.string().max(50),
    sukunimi: z.string().max(50),
    jakeluosoite: z.string().max(30).optional(),
    postinumero: z.string().max(10).optional(),
    postitoimipaikka: z.string().max(30).optional(),
    puhelinnumero: z.string().max(15).optional(),
    tila: z.string().max(20).refine(validateTila),
}) satisfies z.Schema<Prisma.jasenUncheckedCreateInput>;
