import { Prisma } from "@prisma/client";
import { z } from "zod";

// Custom validation function for 'tila' (status)
// Ensures that the status is either 'aktiivinen' (active) or 'poistunut' (removed)
const validateTila = (tila: string): boolean => {
    return tila === "aktiivinen" || tila === "poistunut";
};

// Zod schema for validating 'jasen' (member) input data
// This schema is used when creating or updating member records in the database
export const jasenInput = z.object({
    etunimi: z.string().max(50), // First name, maximum length 50 characters
    sukunimi: z.string().max(50), // Last name, maximum length 50 characters
    jakeluosoite: z.string().max(30).optional(), // Mailing address, optional, max length 30
    postinumero: z.string().max(10).optional(), // Postal code, optional, max length 10
    postitoimipaikka: z.string().max(30).optional(), // City or location, optional, max length 30
    puhelinnumero: z.string().max(15).optional(), // Phone number, optional, max length 15
    tila: z.string().max(20).refine(validateTila), // Status, validated using custom function
}) satisfies z.Schema<Prisma.jasenUncheckedCreateInput>; // Ensures compatibility with Prisma's jasen model
