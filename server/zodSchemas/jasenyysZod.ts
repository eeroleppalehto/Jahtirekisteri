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

    // DateTime for when the member joined the group; accepts both Date object and string that can be parsed into a Date
    liittyi: z.union([
        z.date(),
        z.string().refine(str => !isNaN(Date.parse(str)), {
            message: "Must be a valid date string",
        }),
    ]),

    // Optional DateTime for when the member left the group
    poistui: z.date().optional(),
});

export default jasenyysZod;
