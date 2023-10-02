// Import Prisma client and Zod schema
import prisma from '../client';
import seurueZod from '../zodSchemas/seurueZod';

/**
 * Create a new Seurue.
 * @param {unknown} data - The data for the new Seurue.
 * @returns {Promise} - The created Seurue object.
 */
export const createSeurue = async (data: unknown) => {
    const parsedData = seurueZod.parse(data);
    return await prisma.seurue.create({ data: parsedData });
};

/**
 * Read a Seurue by its ID.
 * @param {number} id - The ID of the Seurue to read.
 * @returns {Promise} - The found Seurue object.
 */
export const readSeurueById = async (id: number) => {
    return await prisma.seurue.findUnique({ where: { seurue_id: id } });
};

/**
 * Update a Seurue by its ID.
 * @param {number} id - The ID of the Seurue to update.
 * @param {unknown} data - The data to update the Seurue with.
 * @returns {Promise} - The updated Seurue object.
 */
export const updateSeurueById = async (id: number, data: unknown) => {
    const parsedData = seurueZod.parse(data);
    return await prisma.seurue.update({
        where: { seurue_id: id },
        data: parsedData,
    });
};

/**
 * Delete a Seurue by its ID.
 * @param {number} id - The ID of the Seurue to delete.
 * @returns {Promise} - The deleted Seurue object.
 */
export const deleteSeurueById = async (id: number) => {
    return await prisma.seurue.delete({ where: { seurue_id: id } });
};

/**
 * Get all Seurueet from the database.
 * @returns {Promise} - An array of all Seurueet.
 */
export const getAllSeurueet = async () => {
    return await prisma.seurue.findMany();
};
