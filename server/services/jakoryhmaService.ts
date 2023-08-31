import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createJakoryhma = async (data: any) => {
  return await prisma.jakoryhma.create({
    data: {
      seurue_id: data.seurue_id,
      ryhman_nimi: data.ryhman_nimi,
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

export const updateJakoryhma = async (id: number, data: any) => {
  return await prisma.jakoryhma.update({
    where: {
      ryhma_id: id,
    },
    data: {
      seurue_id: data.seurue_id,
      ryhman_nimi: data.ryhman_nimi,
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