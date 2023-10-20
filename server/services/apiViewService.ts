/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Import Prisma client and Zod schema
import prisma from '../client';
import viewValidationZod from '../zodSchemas/viewValidationZod';

/**
 * Get view data from the database.
 * @param {string} viewName - The name of the view.
 * @returns {Promise<any>} - The data related to the view.
 */
export const getViewData = async (viewName: string): Promise<any> => {
    const parsedViewName = viewValidationZod.parse(viewName);
    
    // Fetch the existing tables from the database
    const existingTables: { table_name: string }[] = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
    
    // Log the existing tables for debugging
    console.log("Existing tables:", existingTables);

    // Check if the table/view exists in the database
    if (!existingTables.some(table => table.table_name === parsedViewName)) {
        throw new Error(`Table/View ${parsedViewName} does not exist.`);
    }

    // Execute the query
    const data = await prisma.$executeRawUnsafe(`SELECT * FROM ${parsedViewName}`);
    return data;
};
