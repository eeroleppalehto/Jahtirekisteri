/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// Import Prisma client and Zod schema
import prisma from "../client";
import viewValidationZod from "../zodSchemas/viewValidationZod";

/**
 * Get view data from the database.
 * @param {string} viewName - The name of the view.
 * @returns {Promise<object[]>} - The data related to the view.
 */
export const getViewData = async (viewName: string): Promise<object[] | []> => {
    // Validate the view name
    const parsedViewName = viewValidationZod.parse(viewName);
    
    // Construct the query
    const query = `SELECT * FROM ${parsedViewName}`;

    // Execute the query
    const data = await prisma.$queryRawUnsafe<object[]>(query);

};
