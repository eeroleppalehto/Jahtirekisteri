import { Prisma } from "@prisma/client";
import { z } from "zod";

const ROLES = new Set([
    "pääkäyttäjä",
    "muokkaus",
    "lisäys",
    "luku",
    "ei oikeuksia",
]);

export const validateRooli = (rooli: string): boolean => {
    return ROLES.has(rooli);
};

export const kayttajaInput = z.object({
    kayttaja_id: z.number().int().positive(),
    kayttajatunnus: z.string().max(32),
    salasana_hash: z.string().max(255),
    sahkoposti: z.string().email().max(64).optional(),
    roolin_nimi: z.string().max(32).refine(validateRooli),
}) satisfies z.Schema<Prisma.kayttajaUncheckedCreateInput>;

export const loginInput = z.object({
    kayttajatunnus: z.string().max(32),
    salasana: z.string().max(255),
});
