// kaatoService.ts
import prisma from "../client"; // Import Prisma client for database operations
import { kaatoInput } from "../zodSchemas/kaatoZod"; // Import Zod schema for kaato input validation

/**
 * This service module provides CRUD operations for the 'kaato' table in the database.
 * It utilizes the Prisma ORM for interacting with the database and Zod for input validation.
 */

// Read all kaadot (entries) from the 'kaato' table
const getAllKaato = async () => {
    const kaadot = await prisma.kaato.findMany();
    return kaadot;
};

const getKaatoByJasenId = async (id: number) => {
    const kaadot = await prisma.kaato.findMany({
        where: { jasen_id: id },
    });
    return kaadot;
};

// Create a new kaato entry in the 'kaato' table
const createKaato = async (object: unknown) => {
    const data = kaatoInput.parse(object); // Validate input using Zod schema
    const {
        jasen_id,
        kaatopaiva,
        ruhopaino,
        paikka_teksti,
        paikka_koordinaatti,
        elaimen_nimi,
        sukupuoli,
        ikaluokka,
        lisatieto,
    } = data;

    const kaato = await prisma.kaato.create({
        data: {
            jasen_id,
            kaatopaiva,
            ruhopaino,
            paikka_teksti,
            paikka_koordinaatti,
            elaimen_nimi,
            sukupuoli,
            ikaluokka,
            lisatieto,
        },
    });

    return kaato;
};

// Update an existing kaato entry in the 'kaato' table
const updateKaato = async (id: number, object: unknown) => {
    const data = kaatoInput.parse(object); // Validate input using Zod schema
    const {
        jasen_id,
        kaatopaiva,
        ruhopaino,
        paikka_teksti,
        paikka_koordinaatti,
        elaimen_nimi,
        sukupuoli,
        ikaluokka,
        lisatieto,
    } = data;

    const kaato = await prisma.kaato.update({
        where: { kaato_id: id },
        data: {
            jasen_id,
            kaatopaiva,
            ruhopaino,
            paikka_teksti,
            paikka_koordinaatti,
            elaimen_nimi,
            sukupuoli,
            ikaluokka,
            lisatieto,
        },
    });

    return kaato;
};

// Delete an existing kaato entry from the 'kaato' table
const deleteKaato = async (id: number) => {
    const kaato = await prisma.kaato.delete({
        where: { kaato_id: id },
    });

    return kaato;
};

// Export CRUD operations for external use
export default {
    getAllKaato,
    createKaato,
    updateKaato,
    deleteKaato,
    getKaatoByJasenId,
};
