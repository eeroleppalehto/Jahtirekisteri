import jakotapahtumaZod from "../zodSchemas/jakotapahtumaZod";
// import { z } from 'zod';
import prisma from "../client";

// type JakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

export const createJakotapahtuma = async (data: unknown) => {
    const parsedData = jakotapahtumaZod.parse(data);
    return await prisma.jakotapahtuma.create({ data: parsedData });
};

export const readJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.findUnique({
        where: { tapahtuma_id: id },
    });
};

export const updateJakotapahtumaById = async (id: number, data: unknown) => {
    console.log("data: ", data);
    const parsedData = jakotapahtumaZod.parse(data);
    return await prisma.jakotapahtuma.update({
        where: { tapahtuma_id: id },
        data: parsedData,
    });
};

export const deleteJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.delete({ where: { tapahtuma_id: id } });
};

export const getAllJakotapahtumat = async () => {
    return await prisma.jakotapahtuma.findMany();
};
