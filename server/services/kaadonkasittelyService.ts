import kaadonkasittelySchema from "../zodSchemas/kaadonkasittelyZod";
import prisma from '../client';

export const createKaadonkasittely = async (data: unknown) => {
    const validatedData = kaadonkasittelySchema.parse(data);
    return await prisma.kaadon_kasittely.create({ data: validatedData });
};

export const readKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.findUnique({ where: { kaadon_kasittely_id: id } });
};

export const updateKaadonkasittelyById = async (id: number, data: unknown) => {
    const validatedData = kaadonkasittelySchema.parse(data);
    return await prisma.kaadon_kasittely.update({ where: { kaadon_kasittely_id: id }, data: validatedData });
};

export const deleteKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.delete({ where: { kaadon_kasittely_id: id } });
};
