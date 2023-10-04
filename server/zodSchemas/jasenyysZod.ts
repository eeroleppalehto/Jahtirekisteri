import { z } from 'zod';

const jasenyysZod = z.object({
    // Optional integer ID for jasenyys
    jasenyys_id: z.number().int().optional(),

    // Integer ID for the group associated with this jasenyys
    ryhma_id: z.number().int(),

    // Integer ID for the member associated with this jasenyys
    jasen_id: z.number().int(),

    // Integer representing the share of the member in the group
    osuus: z.number().int(),

    // DateTime for when the member joined the group
    liittyi: z.string().datetime(),

    // Optional DateTime for when the member left the group
    poistui: z.string().datetime().optional(),
});

export default jasenyysZod;
