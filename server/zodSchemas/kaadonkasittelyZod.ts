// Import Zod library for schema validation
import { z } from "zod";

// Define Zod schema for kaadonkasittely object
const kaadonkasittelySchema = z.object({
    // Numeric identifier for the kaadon_kasittely
    kaadon_kasittely_id: z.number(),
    
    // Numeric identifier for the type of handling
    kasittelyid: z.number(),

    // Numeric identifier for the kaato (game)
    kaato_id: z.number(),
    
    // Numeric value indicating the amount of handling
    kasittely_maara: z.number()
});

// Export the schema to make it accessible in other modules
export default kaadonkasittelySchema;
