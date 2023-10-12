import kaadonkasittelySchema from "../zodSchemas/kaadonkasittelyZod";
// import { z } from "zod";
import prisma from "../client";

// type KaadonkasittelyType = z.infer<typeof kaadonkasittelySchema>;

export const createKaadonkasittely = async (data: unknown) => {
    const parsedData = kaadonkasittelySchema.parse(data);
    return await prisma.kaadon_kasittely.create({ data: parsedData });
};

export const readKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.findUnique({
        where: { kaadon_kasittely_id: id },
    });
};

export const updateKaadonkasittelyById = async (id: number, data: unknown) => {
    const parsedData = kaadonkasittelySchema.parse(data);

    return await prisma.kaadon_kasittely.update({
        where: { kaadon_kasittely_id: id },
        data: parsedData,
    });
};

export const deleteKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.delete({
        where: { kaadon_kasittely_id: id },
    });
};

export const getAllKaadonkasittelyt = async () => {
    return await prisma.kaadon_kasittely.findMany();
};
