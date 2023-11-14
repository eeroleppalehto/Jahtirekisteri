// Import the Zod library for schema validation
import { z } from "zod";

const validateOsnimitys = (osnimitys: string): boolean => {
    const names = ["Koko", "Puolikas", "Neljännes"];
    if (names.includes(osnimitys)) {
        return true;
    } else {
        return false;
    }
};

// Define the Zod schema for the split event object
const jakotapahtumaJasenZod = z.object({
    // The numeric identifier of the event, which is an integer
    tapahtuma_jasen_id: z.number().int().optional(),

    // Event date as a string in ISO datetime format
    paiva: z.string().datetime(),

    // The numeric identifier of the group, which is an integer
    jasenyys_id: z.number().int(),

    // Short description or title, limited to 20 characters
    osnimitys: z.string().max(20).refine(validateOsnimitys),

    // Numeric identifier of dump_handling, which is an integer
    kaadon_kasittely_id: z.number().int(),

    // A numeric value that indicates a quantity and is an integer
    maara: z.number(),
});

// Export the schema so it can be used in other modules
export default jakotapahtumaJasenZod;
