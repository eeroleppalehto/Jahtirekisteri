import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for validating 'kaato' (hunting catch) input data.
// This schema is used when creating or updating hunting catch records in the database.
export const kaatoInput = z.object({
    jasen_id: z.number().int().positive(), // Member ID, must be a positive integer
    kaatopaiva: z.string().datetime(), // Catch date, must be a valid datetime string
    ruhopaino: z.number().positive(), // Weight of the carcass, must be a positive number
    paikka_teksti: z.string().max(100), // Text description of the location, max length 100 characters
    paikka_koordinaatti: z.string().max(100).optional(), // Location coordinates, optional, max length 100 characters
    elaimen_nimi: z.string().max(20), // Name of the animal, max length 20 characters
    sukupuoli: z.string().max(20), // Gender of the animal, max length 20 characters
    ikaluokka: z.string().max(20), // Age category of the animal, max length 20 characters
    lisatieto: z.string().max(255).optional(), // Additional information, optional, max length 255 characters
}) satisfies z.Schema<Prisma.kaatoUncheckedCreateInput>; // Ensures compatibility with Prisma's kaato model
