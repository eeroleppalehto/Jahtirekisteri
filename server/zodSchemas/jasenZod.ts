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
    jakeluosoite: z.string().max(30),
    postinumero: z.string().max(10),
    postitoimipaikka: z.string().max(30),
    tila: z.string().max(20).refine(validateTila),
}) satisfies z.Schema<Prisma.jasenUncheckedCreateInput>;

