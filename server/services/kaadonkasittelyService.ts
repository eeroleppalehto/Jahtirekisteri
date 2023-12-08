// kaadonkasittelyService.ts
import kaadonkasittelySchema from "../zodSchemas/kaadonkasittelyZod"; // Import Zod schema for kaadonkasittely data validation
import prisma from "../client"; // Import Prisma client for database operations

/**
 * Service module for handling CRUD operations for 'kaadon_kasittely' table.
 * Utilizes Prisma ORM for database interactions and Zod for input validation.
 */

// Create a new 'kaadon_kasittely' record in the database
export const createKaadonkasittely = async (data: unknown) => {
    const parsedData = kaadonkasittelySchema.parse(data); // Validate input data using Zod schema
    return await prisma.kaadon_kasittely.create({ data: parsedData });
};

// Retrieve a 'kaadon_kasittely' record by its unique ID
export const readKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.findUnique({
        where: { kaadon_kasittely_id: id },
    });
};

// Update an existing 'kaadon_kasittely' record by its unique ID
export const updateKaadonkasittelyById = async (id: number, data: unknown) => {
    const parsedData = kaadonkasittelySchema.parse(data); // Validate and parse input data
    return await prisma.kaadon_kasittely.update({
        where: { kaadon_kasittely_id: id },
        data: parsedData,
    });
};

// Delete a 'kaadon_kasittely' record by its unique ID
export const deleteKaadonkasittelyById = async (id: number) => {
    return await prisma.kaadon_kasittely.delete({
        where: { kaadon_kasittely_id: id },
    });
};

// Retrieve all 'kaadon_kasittely' records from the database
export const getAllKaadonkasittelyt = async () => {
    return await prisma.kaadon_kasittely.findMany();
};
