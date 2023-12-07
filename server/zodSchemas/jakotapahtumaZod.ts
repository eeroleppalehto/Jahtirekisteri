import { z } from "zod";

// Custom validation function for the 'osnimitys' field
// It checks if the given value is one of the predefined names
const validateOsnimitys = (osnimitys: string): boolean => {
    const validNames = ["Koko", "Puolikas", "Neljännes"];
    return validNames.includes(osnimitys);
};

// Zod schema definition for Jakotapahtuma
const jakotapahtumaZod = z.object({
    // Optional integer ID for the jakotapahtuma (event) entity
    tapahtuma_id: z.number().int().optional(),

    // Date field for the event, changed to use z.date() to match Prisma's DateTime type
    paiva: z.date(),

    // Integer ID for the ryhma (group) associated with this event
    ryhma_id: z.number().int(),

    // String field for a short description or title, validated by a custom function
    osnimitys: z.string().max(20).refine(validateOsnimitys),

    // Integer ID for the kaadon kasittely (processing event) associated with this event
    kaadon_kasittely_id: z.number().int(),

    // Numeric field to indicate a quantity
    maara: z.number(),
});

export default jakotapahtumaZod;

// Explanation of Changes:
// The 'paiva' field was changed to use 'z.date()' to ensure consistency with the Prisma schema's DateTime type.
// The 'validateOsnimitys' function provides custom validation for the 'osnimitys' field, ensuring it matches one of the predefined names.
