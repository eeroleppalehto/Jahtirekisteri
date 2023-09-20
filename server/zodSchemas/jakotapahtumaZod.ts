// Import Zod for schema validation
import { z } from 'zod';

// Define Zod schema for jakotapahtuma object
const jakotapahtumaZod = z.object({
    // Numeric identifier for the event
    tapahtuma_id: z.number(),
    
    // Date of the event as a string
    paiva: z.string(),

    // Numeric identifier for the group
    ryhma_id: z.number(),
    
    // Short description or title, limited to 20 characters
    osnimitys: z.string().max(20),

    // Numeric identifier for kaadon_kasittely (handling of the game)
    kaadon_kasittely_id: z.number(),

    // Numeric value indicating the quantity
    maara: z.number(),
});

// Export the schema for use in other modules
export default jakotapahtumaZod;
