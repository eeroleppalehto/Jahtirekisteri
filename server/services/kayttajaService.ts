/* 2024-01-17 Eero Leppälehto kayttajaService */

import prisma from "../client";
import { kayttajaInput, validateRooli } from "../zodSchemas/kayttajaValidation";

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

type MemberName = {
    etunimi: string;
    sukunimi: string;
};

const getMemberByUsername = async (username: string) => {
    const memberNames = await prisma.$queryRaw<MemberName[]>`
        SELECT jasen.etunimi,
            jasen.sukunimi
        FROM jasen
        INNER JOIN kayttaja ON jasen.jasen_id = kayttaja.jasen_id
        WHERE kayttaja.kayttajatunnus = ${username}
    `;

    if (memberNames.length === 0) {
        throw new Error("No member found");
    }

    return memberNames[0];
};

const createKayttaja = async (object: unknown) => {
    const data = kayttajaInput.parse(object);
    const { kayttajatunnus, salasana_hash, jasen_id, sahkoposti, roolin_nimi } =
        data;

    const kayttaja = await prisma.kayttaja.create({
        data: {
            kayttajatunnus,
            salasana_hash,
            jasen_id,
            sahkoposti,
            roolin_nimi,
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

const updateKayttajaRooli = async (username: string, newRole: string) => {
    if (!validateRooli(newRole)) {
        throw new Error("Invalid role");
    }

    const kayttaja = await prisma.kayttaja.update({
        where: { kayttajatunnus: username },
        data: { roolin_nimi: newRole },
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
    getMemberByUsername,
    createKayttaja,
    updateKayttajanimi,
    updateKayttajaSalasana,
    updateKayttajaRooli,
    deleteKayttaja,
};
