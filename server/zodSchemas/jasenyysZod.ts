import { z } from "zod";

const jasenyysZod = z.object({
    // Optional integer ID for the jasenyys entity
    jasenyys_id: z.number().int().optional(),

    // Integer ID for the seurue (group) associated with this jasenyys
    seurue_id: z.number().int(),

    // Optional integer ID for the ryhma (subgroup) associated with this jasenyys
    ryhma_id: z.number().int().optional(),

    // Integer ID for the member (jasen) associated with this jasenyys
    jasen_id: z.number().int(),

    // Integer representing the member's share or participation in the group
    osuus: z.number().int(),

    // Date when the member joined the group
    liittyi: z.date(),

    // Optional date when the member left the group
    poistui: z.date().optional(),
});

export default jasenyysZod;

// Explanation of Changes:
// The `jasenyysZod` schema was modified to ensure consistency between the Zod schema and the Prisma schema.
// Specifically, the types for the `liittyi` and `poistui` fields were changed from string to date types.
// This change was necessary to match the DateTime fields in the Prisma schema, ensuring accurate data validation and handling.
