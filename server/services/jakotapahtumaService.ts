// jakotapahtumaService.ts
import jakotapahtumaZod from "../zodSchemas/jakotapahtumaZod"; // Import Zod schema for jakotapahtuma data validation
import prisma from "../client"; // Import Prisma client for database operations

/**
 * Service module for handling CRUD operations for 'jakotapahtuma' table.
 * Utilizes Prisma ORM for database interactions and Zod for input validation.
 */

// Create a new 'jakotapahtuma' record in the database
export const createJakotapahtuma = async (data: unknown) => {
    const parsedData = jakotapahtumaZod.parse(data); // Validate input data using Zod schema
    return await prisma.jakotapahtuma.create({ data: parsedData });
};

// Retrieve a 'jakotapahtuma' record by its unique ID
export const readJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.findUnique({
        where: { tapahtuma_id: id }, // Specify the ID to find the record
    });
};

// Update an existing 'jakotapahtuma' record by its unique ID
export const updateJakotapahtumaById = async (id: number, data: unknown) => {
    console.log("data: ", data); // Optional: Logging the input data
    const parsedData = jakotapahtumaZod.parse(data); // Validate and parse input data
    return await prisma.jakotapahtuma.update({
        where: { tapahtuma_id: id },
        data: parsedData,
    });
};

// Delete a 'jakotapahtuma' record by its unique ID
export const deleteJakotapahtumaById = async (id: number) => {
    return await prisma.jakotapahtuma.delete({ where: { tapahtuma_id: id } }); // Specify the ID for deletion
};

// Retrieve all 'jakotapahtuma' records from the database
export const getAllJakotapahtumat = async () => {
    return await prisma.jakotapahtuma.findMany(); // Fetch all jakotapahtuma records
};
