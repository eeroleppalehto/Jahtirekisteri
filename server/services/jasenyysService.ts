// Import Prisma client and Zod schema
import prisma from '../client';
import jasenyysZod from '../zodSchemas/jasenyysZod';

/**
 * Create a new Jasenyys.
 * @param {unknown} data - The data for the new Jasenyys.
 * @returns {Promise} - The created Jasenyys object.
 */
export const createJasenyys = async (data: unknown) => {
    const parsedData = jasenyysZod.parse(data);
    return await prisma.jasenyys.create({ data: parsedData });
};

/**
 * Read a Jasenyys by its ID.
 * @param {number} id - The ID of the Jasenyys to read.
 * @returns {Promise} - The found Jasenyys object.
 */
export const readJasenyysById = async (id: number) => {
    return await prisma.jasenyys.findUnique({ where: { jasenyys_id: id } });
};

/**
 * Update a Jasenyys by its ID.
 * @param {number} id - The ID of the Jasenyys to update.
 * @param {unknown} data - The data to update the Jasenyys with.
 * @returns {Promise} - The updated Jasenyys object.
 */
export const updateJasenyysById = async (id: number, data: unknown) => {
    const parsedData = jasenyysZod.parse(data);
    return await prisma.jasenyys.update({
        where: { jasenyys_id: id },
        data: parsedData,
    });
};

/**
 * Delete a Jasenyys by its ID.
 * @param {number} id - The ID of the Jasenyys to delete.
 * @returns {Promise} - The deleted Jasenyys object.
 */
export const deleteJasenyysById = async (id: number) => {
    return await prisma.jasenyys.delete({ where: { jasenyys_id: id } });
};

/**
 * Get all Jasenyydet from the database.
 * @returns {Promise} - An array of all Jasenyydet.
 */
export const getAllJasenyydet = async () => {
    return await prisma.jasenyys.findMany();
};
