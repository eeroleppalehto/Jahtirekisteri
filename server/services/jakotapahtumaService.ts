import jakotapahtumaZod from '../zodSchemas/jakotapahtumaZod';
import { z } from 'zod';
import prisma from '../client';

type jakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

export const createJakotapahtuma = async (data: jakotapahtumaType) => {
    return await prisma.jakotapahtuma.create({ data });
};

export const readJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.findUnique({ where: { tapahtuma_id: id } });
};

export const updateJakotapahtumaById = async (id: number, data: Partial<jakotapahtumaType>) => {
    return await prisma.jakotapahtuma.update({ where: { tapahtuma_id: id }, data });
};

export const deleteJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.delete({ where: { tapahtuma_id: id } });
};

export const getAllJakotapahtumat = async () => {
    return await prisma.jakotapahtuma.findMany();
};
