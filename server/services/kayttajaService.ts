/* 2024-01-17 Eero Leppälehto kayttajaService */

import prisma from "../client";
import { kayttajaInput } from "../zodSchemas/kayttajaValidation";

/**
 * Service module for handling CRUD operations for 'kayttaja' table.
 * Utilizes Prisma ORM for database interactions and Zod for data validation.
 */

const getAllKayttaja = async () => {
    const kayttajat = await prisma.kayttaja.findMany();
    return kayttajat;
};

const getKayttajaByUsername = async (username: string) => {
    const kayttaja = await prisma.kayttaja.findUnique({
        where: { kayttajatunnus: username },
    });
    return kayttaja;
};

const createKayttaja = async (object: unknown) => {
    const data = kayttajaInput.parse(object);
    const { kayttaja_id, kayttajatunnus, salasana_hash, sahkoposti } = data;

    const kayttaja = await prisma.kayttaja.create({
        data: {
            kayttaja_id,
            kayttajatunnus,
            salasana_hash,
            sahkoposti,
        },
    });

    return kayttaja;
};

const updateKayttajanimi = async (username: string, newUsername: string) => {
    const kayttaja = await prisma.kayttaja.update({
        where: { kayttajatunnus: username },
        data: { kayttajatunnus: newUsername },
    });

    return kayttaja;
};

const updateKayttajaSalasana = async (username: string, newHash: string) => {
    const kayttaja = await prisma.kayttaja.update({
        where: { kayttajatunnus: username },
        data: { salasana_hash: newHash },
    });

    return kayttaja;
};

const deleteKayttaja = async (username: string) => {
    const kayttaja = await prisma.kayttaja.delete({
        where: { kayttajatunnus: username },
    });

    return kayttaja;
};

export default {
    getAllKayttaja,
    getKayttajaByUsername,
    createKayttaja,
    updateKayttajanimi,
    updateKayttajaSalasana,
    deleteKayttaja,
};
