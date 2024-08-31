// jakotapahtumaJasenService.ts
import jakotapahtumaJasenZod from "../zodSchemas/jakotapahtumaJasenZod"; // Import Zod schema for jakotapahtumaJasen data validation
import prisma from "../client"; // Import Prisma client for database operations

/**
 * Service module for handling CRUD operations for 'jakotapahtuma_jasen' table.
 * Utilizes Prisma ORM for database interactions and Zod for input validation.
 */

// Create a new 'jakotapahtuma_jasen' record in the database
export const createJakotapahtumaJasen = async (data: unknown) => {
    const parsedData = jakotapahtumaJasenZod.parse(data); // Validate input data using Zod schema
    return await prisma.jakotapahtuma_jasen.create({ data: parsedData });
};

// Retrieve a 'jakotapahtuma_jasen' record by its unique ID
export const readJakotapahtumaJasenById = async (id: number) => {
    return await prisma.jakotapahtuma_jasen.findUnique({
        where: { tapahtuma_jasen_id: id }, // Specify the ID to find the record
    });
};

// Update an existing 'jakotapahtuma_jasen' record by its unique ID
export const updateJakotapahtumaJasenById = async (
    id: number,
    data: unknown
) => {
    const parsedData = jakotapahtumaJasenZod.parse(data); // Validate and parse input data
    return await prisma.jakotapahtuma_jasen.update({
        where: { tapahtuma_jasen_id: id },
        data: parsedData,
    });
};

// Delete a 'jakotapahtuma_jasen' record by its unique ID
export const deleteJakotapahtumaJasenById = async (id: number) => {
    return await prisma.jakotapahtuma_jasen.delete({
        where: { tapahtuma_jasen_id: id }, // Specify the ID for deletion
    });
};

// Retrieve all 'jakotapahtuma_jasen' records from the database
export const getAllJakotapahtumaJasen = async () => {
    return await prisma.jakotapahtuma_jasen.findMany(); // Fetch all jakotapahtuma_jasen records
};
