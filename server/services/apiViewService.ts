/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// Import Prisma client and Zod schema
import prisma from "../client";
import viewValidationZod from "../zodSchemas/viewValidationZod";
import { viewMap } from "../utils/viewMap";

/**
 * Get view data from the database.
 * @param {string} viewName - The name of the view.
 * @returns {Promise<object[]>} - The data related to the view.
 */
export const getViewData = async (viewName: string): Promise<object[] | []> => {
    // Validate the view name
    const parsedViewName = viewValidationZod.parse(viewName);

    // Construct the query
    // const query = `SELECT * FROM ${parsedViewName}`;

    const query = viewMap.get(parsedViewName);
    if (!query) throw new Error("Invalid view name");

    // Execute the query
    const data = await prisma.$queryRawUnsafe<object[]>(query);

    // There is a bug that causes bigint values to be returned as BigInt objects instead of strings.
    // The following code parses the data to convert bigint values to strings
    const parsedData: object[] = data.map((row) => {
        const jsonString = JSON.stringify(row, (_key, value) => {
            return typeof value === "bigint" ? value.toString() : value;
        });

        const obj: object = JSON.parse(jsonString);

        return obj;
    });

    return parsedData;
};
