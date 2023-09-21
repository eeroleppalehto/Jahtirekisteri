// Import the Zod library for schema validation
import { z } from 'zod';

// Define the Zod schema for the split event object
const jakotapahtumaZod = z.object({
    // The numeric identifier of the event, which is an integer
    tapahtuma_id: z.number().int(),
    
    // Event date as a string in ISO datetime format
    paiva: z.string().datetime(),

    // The numeric identifier of the group, which is an integer
    ryhma_id: z.number().int(),
    
    // Short description or title, limited to 20 characters
    osnimitys: z.string().max(20),

    // Numeric identifier of dump_handling, which is an integer
    kaadon_kasittely_id: z.number().int(),

    // A numeric value that indicates a quantity and is an integer
    maara: z.number().int(),
});

// Export the schema so it can be used in other modules
export default jakotapahtumaZod;
