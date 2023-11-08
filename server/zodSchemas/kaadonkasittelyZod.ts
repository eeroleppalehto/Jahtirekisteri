// Import the Zod library for schema validation
import { z } from "zod";

// Define the Zod schema for the dump handling object
const kaadonkasittelySchema = z.object({
    // Numeric identifier of dump_handling, which is an integer
    kaadon_kasittely_id: z.number().int().optional(),

    // Numeric identifier of the processing type, which is an integer
    kasittelyid: z.number().int(),

    // Numeric identifier of the dump, which is an integer
    kaato_id: z.number().int(),

    // A numeric value that indicates the amount of processing and is an integer
    kasittely_maara: z.number().int(),
});

// Zod schema for validating the shot usage object without the shot usage id
// and shot id fields
export const kaadonkasittelySchemaOnlyKasittely = kaadonkasittelySchema.omit({
    kaadon_kasittely_id: true,
    kaato_id: true,
});

// Export the schema so it can be used in other modules
export default kaadonkasittelySchema;
