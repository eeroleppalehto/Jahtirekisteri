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
    kayttaja_id: z.number().int().positive().optional(),
    kayttajatunnus: z.string().max(32),
    salasana_hash: z.string().max(255),
    jasen_id: z.number().int().positive(),
    sahkoposti: z.string().email().max(64).optional(),
    roolin_nimi: z.string().max(32).refine(validateRooli),
}) satisfies z.Schema<Prisma.kayttajaUncheckedCreateInput>;

export const loginInput = z.object({
    kayttajatunnus: z.string().max(32),
    salasana: z.string().max(255),
});

export const passwordChangeInput = z.object({
    oldPassword: z.string().max(255),
    // At least 7 characters long and must contain at least one number, special character, uppercase and lowercase letter.
    newPassword: z
        .string()
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-ZÄÖÅ])(?=.*[a-zäöå]).{8,}$/)
        .max(255),
    confirmNewPassword: z.string().max(255),
});
