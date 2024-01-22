import { Prisma } from "@prisma/client";
import { z } from "zod";

export const kayttajaInput = z.object({
    kayttaja_id: z.number().int().positive(),
    kayttajatunnus: z.string().max(32),
    salasana_hash: z.string().max(255),
    sahkoposti: z.string().email().max(64).optional(),
}) satisfies z.Schema<Prisma.kayttajaUncheckedCreateInput>;

export const loginInput = z.object({
    kayttajatunnus: z.string().max(32),
    salasana: z.string().max(255),
});
