import prisma from "../client";
import { kaatoInput } from "../zodSchemas/kaatoZod";

// Define CRUD operations for kaato table

// Read all kaadot
const getAllKaato = async () => {
    const kaadot = await prisma.kaato.findMany();
    return kaadot;
};

// Create a new kaato
const createKaato = async (object: unknown) => {
    const data = kaatoInput.parse(object);
    const { 
        jasen_id,
        kaatopaiva,
        ruhopaino,
        paikka_teksti,
        paikka_koordinaatti,
        elaimen_nimi,
        sukupuoli,
        ikaluokka,
        lisatieto } = data;

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
            lisatieto
        }
    }); 

    return kaato;
};

// Update an existing kaato
const updateKaato = async (id: number, object: unknown) => {
    const data = kaatoInput.parse(object);
    const { 
        jasen_id,
        kaatopaiva,
        ruhopaino,
        paikka_teksti,
        paikka_koordinaatti,
        elaimen_nimi,
        sukupuoli,
        ikaluokka,
        lisatieto } = data;

    const kaato = await prisma.kaato.update({
        where: 
            { kaato_id: id },
        data: {
            jasen_id,
            kaatopaiva,
            ruhopaino,
            paikka_teksti,
            paikka_koordinaatti,
            elaimen_nimi,
            sukupuoli,
            ikaluokka,
            lisatieto
        }
    });

    return kaato;
};

// Delete an existing kaato
const deleteKaato = async (id: number) => {
    const kaato = await prisma.kaato.delete({
        where: { kaato_id: id }
    });

    return kaato;
};

export default { getAllKaato, createKaato, updateKaato, deleteKaato };