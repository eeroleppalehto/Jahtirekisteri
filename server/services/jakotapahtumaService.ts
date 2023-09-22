import jakotapahtumaZod from '../zodSchemas/jakotapahtumaZod';
import { z } from 'zod';
import prisma from '../client';

type JakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

export const createJakotapahtuma = async (data: JakotapahtumaType) => {
    const parsedData = jakotapahtumaZod.parse(data);
    return await prisma.jakotapahtuma.create({ data: parsedData });
};

export const readJakotapahtumaById = async (id: number) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    return await prisma.jakotapahtuma.findUnique({ where: { tapahtuma_id: id } });
};

export const updateJakotapahtumaById = async (id: number, data: Partial<JakotapahtumaType>) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    const parsedData = jakotapahtumaZod.safeParse(data);
    if (!parsedData.success) throw new Error("Invalid data");
    return await prisma.jakotapahtuma.update({ where: { tapahtuma_id: id }, data: parsedData.data });
};

export const deleteJakotapahtumaById = async (id: number) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    return await prisma.jakotapahtuma.delete({ where: { tapahtuma_id: id } });
};

export const getAllJakotapahtumat = async () => {
    return await prisma.jakotapahtuma.findMany();
};
