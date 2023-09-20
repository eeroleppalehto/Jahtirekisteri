// Import PrismaClient for database operations and Zod for schema validation
import { PrismaClient } from '@prisma/client';
import jakotapahtumaZod from '../zodSchemas/jakotapahtumaZod';
import { z } from 'zod';

// Initialize a new PrismaClient instance
const prisma = new PrismaClient();

// Define the TypeScript type for Jakotapahtuma based on the Zod schema
type jakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

// Create a flexible type that can handle either string or Date types for the 'paiva' field
type jakotapahtumaTypeWithFlexibleDate = Omit<jakotapahtumaType, 'paiva'> & { paiva: string | Date };

// Function to create a new Jakotapahtuma entry
export const create = async (data: jakotapahtumaType) => {
    // Prepare new data while handling string or Date types for 'paiva'
    const newData: jakotapahtumaTypeWithFlexibleDate = { ...data };
    if (typeof newData.paiva === 'string') {
        newData.paiva = new Date(newData.paiva);
    }
    return await prisma.jakotapahtuma.create({ data: newData as jakotapahtumaType });
};

// Function to read a Jakotapahtuma entry by its ID
export const read = async (id: number) => {
    return await prisma.jakotapahtuma.findUnique({ where: { tapahtuma_id: id } });
};

// Function to update an existing Jakotapahtuma entry
export const update = async (id: number, data: Partial<jakotapahtumaType>) => {
    // Prepare new data while handling string or Date types for 'paiva'
    const newData: Partial<jakotapahtumaTypeWithFlexibleDate> = { ...data };
    if (newData.paiva && typeof newData.paiva === 'string') {
        newData.paiva = new Date(newData.paiva);
    }
    return await prisma.jakotapahtuma.update({ where: { tapahtuma_id: id }, data: newData as Partial<jakotapahtumaType> });
};

// Function to delete a Jakotapahtuma entry
export const del = async (id: number) => {
    return await prisma.jakotapahtuma.delete({ where: { tapahtuma_id: id } });
};

// Newly added function to retrieve all Jakotapahtuma entries
export const getAll = async () => {
    return await prisma.jakotapahtuma.findMany();
};
