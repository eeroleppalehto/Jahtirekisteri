import jakotapahtumaJasenZod from "../zodSchemas/jakotapahtumaJasenZod";
// import { z } from 'zod';
import prisma from "../client";

// type JakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

export const createJakotapahtumaJasen = async (data: unknown) => {
    const parsedData = jakotapahtumaJasenZod.parse(data);
    return await prisma.jakotapahtuma_jasen.create({ data: parsedData });
};

export const readJakotapahtumaJasenById = async (id: number) => {
    return await prisma.jakotapahtuma_jasen.findUnique({
        where: { tapahtuma_jasen_id: id },
    });
};

export const updateJakotapahtumaJasenById = async (
    id: number,
    data: unknown
) => {
    const parsedData = jakotapahtumaJasenZod.parse(data);
    return await prisma.jakotapahtuma_jasen.update({
        where: { tapahtuma_jasen_id: id },
        data: parsedData,
    });
};

export const deleteJakotapahtumaJasenById = async (id: number) => {
    return await prisma.jakotapahtuma_jasen.delete({
        where: { tapahtuma_jasen_id: id },
    });
};

export const getAllJakotapahtumaJasen = async () => {
    return await prisma.jakotapahtuma_jasen.findMany();
};
