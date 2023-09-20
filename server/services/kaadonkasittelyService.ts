// Import PrismaClient for database operations and Zod schema for validation
import { PrismaClient } from "@prisma/client";
import kaadonkasittelySchema from "../zodSchemas/kaadonkasittelyZod";

// Initialize a new PrismaClient instance
const prisma = new PrismaClient();

// Function to create a new Kaadonkasittely record
export const createKaadonkasittely = async (data: unknown) => {
    // Validate incoming data against Zod schema
    const validatedData = kaadonkasittelySchema.parse(data);
    // Insert the new record into the database
    return await prisma.kaadon_kasittely.create({
        data: validatedData,
    });
};

// Function to read a Kaadonkasittely record by its ID
export const readKaadonkasittely = async (id: number) => {
    // Fetch the record by its ID from the database
    return await prisma.kaadon_kasittely.findUnique({
        where: { kaadon_kasittely_id: id },
    });
};

// Function to update an existing Kaadonkasittely record
export const updateKaadonkasittely = async (id: number, data: unknown) => {
    // Validate the updated data against the Zod schema
    const validatedData = kaadonkasittelySchema.parse(data);
    // Update the record in the database
    return await prisma.kaadon_kasittely.update({
        where: { kaadon_kasittely_id: id },
        data: validatedData,
    });
};

// Function to delete a Kaadonkasittely record
export const deleteKaadonkasittely = async (id: number) => {
    // Delete the record by its ID from the database
    return await prisma.kaadon_kasittely.delete({
        where: { kaadon_kasittely_id: id },
    });
};
