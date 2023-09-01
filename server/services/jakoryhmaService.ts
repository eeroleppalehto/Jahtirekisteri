import { JakoryhmaSchema } from "../zodSchemas/jakoryhmaZod";

export const createJakoryhma = async (data: unknown) => {
    const parsedData = JakoryhmaSchema.parse(data);

  return await prisma.jakoryhma.create({
    data: {
            seurue_id: parsedData.seurue_id,
            ryhman_nimi: parsedData.ryhman_nimi,
    },
  });
};

export const getAllJakoryhma = async () => {
  return await prisma.jakoryhma.findMany();
};

export const readJakoryhma = async (id: number) => {
  return await prisma.jakoryhma.findUnique({
    where: {
      ryhma_id: id,
    },
  });
};

export const updateJakoryhma = async (id: number, data: unknown) => {
    const parsedData = JakoryhmaSchema.parse(data);

  return await prisma.jakoryhma.update({
    where: {
      ryhma_id: id,
    },
    data: {
            seurue_id: parsedData.seurue_id,
            ryhman_nimi: parsedData.ryhman_nimi,
    },
  });
};

export const deleteJakoryhma = async (id: number) => {
  return await prisma.jakoryhma.delete({
    where: {
      ryhma_id: id,
    },
  });
};
