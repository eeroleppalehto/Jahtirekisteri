import { z } from 'zod';

const seurueZod = z.object({
    // Integer ID for the seurue, now made optional
    seurue_id: z.number().int().optional(),

    // Integer ID for the seura associated with this seurue
    seura_id: z.number().int(),

    // The name of the seurue, up to 50 characters
    seurueen_nimi: z.string().max(50),

    // Integer ID for the member associated with this seurue
    jasen_id: z.number().int()
});

export default seurueZod;
