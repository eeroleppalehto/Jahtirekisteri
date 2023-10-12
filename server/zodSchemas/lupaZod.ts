// Import Zod library for schema validation
import { z } from 'zod';

// Define the Zod schema for lupa
// Specifies the expected type and constraints for each field
const lupaZod = z.object({
    luparivi_id: z.number().optional(), // Numeric identifier
    seura_id: z.number(),             // Numeric identifier for 'seura'
    lupavuosi: z.string().max(4),     // String year with a maximum length of 4
    elaimen_nimi: z.string().max(20), // Animal name with a maximum length of 20
    sukupuoli: z.string().max(20),    // Gender with a maximum length of 20
    ikaluokka: z.string().max(20),    // Age category with a maximum length of 20
    maara: z.number(),                // Numeric quantity
});

// Export the Zod schema
export default lupaZod;
