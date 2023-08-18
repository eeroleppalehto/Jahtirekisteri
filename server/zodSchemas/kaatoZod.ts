import { Prisma } from "@prisma/client";
import { z } from "zod";

export const kaatoInput = z.object({
    jasen_id: z.number().int().positive(),
    kaatopaiva: z.string().datetime(),
    ruhopaino: z.number().positive(),
    paikka_teksti: z.string().max(100),
    paikka_koordinaatti: z.string().max(100).optional(),
    elaimen_nimi: z.string().max(20),
    sukupuoli: z.string().max(20),
    ikaluokka: z.string().max(20),
    lisatieto: z.string().max(255).optional(),
}) satisfies z.Schema<Prisma.kaatoUncheckedCreateInput>;
