// Import Prisma client and Zod schema for Jakoryhma
import prisma from "../client";
import { JakoryhmaSchema } from "../zodSchemas/jakoryhmaZod";

// Function to create a new Jakoryhma
export const createJakoryhma = async (data: unknown) => {
    // Validate incoming data using Zod schema
    const parsedData = JakoryhmaSchema.parse(data);
    
    // Create a new Jakoryhma record in the database
    return await prisma.jakoryhma.create({
        data: {
            seurue_id: parsedData.seurue_id,
            ryhman_nimi: parsedData.ryhman_nimi,
        },
    });
};

// Function to fetch all Jakoryhma records
export const getAllJakoryhma = async () => {
    // Retrieve all Jakoryhma records from the database
    return await prisma.jakoryhma.findMany();
};

// Function to read a single Jakoryhma by ID
export const readJakoryhma = async (id: number) => {
    // Find and return the Jakoryhma record with the given ID
    return await prisma.jakoryhma.findUnique({
        where: {
            ryhma_id: id,
        },
    });
};

// Function to update a Jakoryhma by ID
export const updateJakoryhma = async (id: number, data: unknown) => {
    // Validate incoming data using Zod schema
    const parsedData = JakoryhmaSchema.parse(data);
    
    // Update the Jakoryhma record with the new data
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

// Function to delete a Jakoryhma by ID
export const deleteJakoryhma = async (id: number) => {
    // Delete the Jakoryhma record with the given ID
    return await prisma.jakoryhma.delete({
        where: {
            ryhma_id: id,
        },
    });
};
