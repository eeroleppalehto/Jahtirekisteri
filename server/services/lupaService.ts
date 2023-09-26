// Import required libraries and modules
import lupaZod from '../zodSchemas/lupaZod';  // Zod schema for lupa validation
import prisma from '../client';  // Prisma client for database connection

// Function to create a new 'lupa' record in the database
// Validates incoming data using the lupaZod schema
export const createLupa = async (data: unknown) => {
    const parsedData = lupaZod.parse(data);  // Validate and parse the data
    return await prisma.lupa.create({ data: parsedData });  // Create a new record in the database
};

// Function to read a 'lupa' record from the database by its ID
export const readLupaById = async (id: number) => {
    return await prisma.lupa.findUnique({ where: { luparivi_id: id } });  // Fetch the record based on its ID
};

// Function to update a 'lupa' record in the database by its ID and data
// Validates incoming data using the lupaZod schema
export const updateLupaById = async (id: number, data: unknown) => {
    const parsedData = lupaZod.parse(data);  // Validate and parse the data
    return await prisma.lupa.update({ where: { luparivi_id: id }, data: parsedData });  // Update the record
};

// Function to delete a 'lupa' record from the database by its ID
export const deleteLupaById = async (id: number) => {
    return await prisma.lupa.delete({ where: { luparivi_id: id } });  // Delete the record
};
