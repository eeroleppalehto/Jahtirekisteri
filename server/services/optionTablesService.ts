/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// Import Prisma client
import prisma from "../client"; // Prisma client for database queries

/**
 * Get all aikuinenvasa data from the database.
 * @returns {Promise<object[]>} - The data related to the aikuinenvasa table.
 */
export const getAllAikuinenvasa = async (): Promise<object[]> => {
    const data = await prisma.$queryRawUnsafe<object[]>(
        "SELECT * FROM aikuinenvasa"
    );
    return data;
};

/**
 * Get all elain data from the database.
 * @returns {Promise<object[]>} - The data related to the elain table.
 */
export const getAllElain = async (): Promise<object[]> => {
    const data = await prisma.$queryRawUnsafe<object[]>("SELECT * FROM elain");
    return data;
};

/**
 * Get all kasittely data from the database.
 * @returns {Promise<object[]>} - The data related to the kasittely table.
 */
export const getAllKasittely = async (): Promise<object[]> => {
    const data = await prisma.$queryRawUnsafe<object[]>(
        "SELECT * FROM kasittely"
    );
    return data;
};

/**
 * Get all lupa data from the database.
 * @returns {Promise<object[]>} - The data related to the lupa table.
 */
export const getAllRuhonosa = async (): Promise<object[]> => {
    const data = await prisma.$queryRawUnsafe<object[]>(
        "SELECT * FROM ruhonosa"
    );
    return data;
};

/**
 * Get all sukupuoli data from the database.
 * @returns {Promise<object[]>} - The data related to the sukupuoli table.
 */
export const getAllSukupuoli = async (): Promise<object[]> => {
    const data = await prisma.$queryRawUnsafe<object[]>(
        "SELECT * FROM sukupuoli"
    );
    return data;
};
