import kaadonkasittelySchema from '../zodSchemas/kaadonkasittelyZod';
import { z } from 'zod';
import prisma from '../client';

type KaadonkasittelyType = z.infer<typeof kaadonkasittelySchema>;

export const createKaadonkasittely = async (data: KaadonkasittelyType) => {
    const parsedData = kaadonkasittelySchema.parse(data);
    return await prisma.kaadon_kasittely.create({ data: parsedData });
};

export const readKaadonkasittelyById = async (id: number) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    return await prisma.kaadon_kasittely.findUnique({ where: { kaadon_kasittely_id: id } });
};

export const updateKaadonkasittelyById = async (id: number, data: Partial<KaadonkasittelyType>) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    const parsedData = kaadonkasittelySchema.safeParse(data);
    if (!parsedData.success) throw new Error("Invalid data");
    return await prisma.kaadon_kasittely.update({ where: { kaadon_kasittely_id: id }, data: parsedData.data });
};

export const deleteKaadonkasittelyById = async (id: number) => {
    if (!Number.isInteger(id)) throw new Error("Invalid ID");
    return await prisma.kaadon_kasittely.delete({ where: { kaadon_kasittely_id: id } });
};
