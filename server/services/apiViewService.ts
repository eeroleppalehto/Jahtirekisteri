/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// Import Prisma client and Zod schema
import prisma from "../client";
import viewValidationZod from "../zodSchemas/viewValidationZod";
import { columnValidation } from "../zodSchemas/columnValidation";
import { viewMap } from "../utils/viewMap";

type Params = {
    column: string | number;
    value: number;
};

/**
 * Get view data from the database. Allows filtering by column and value.
 * @param {string} viewName - The name of the view.
 * @param {string} column - The column name.(optional)
 * @param {string} value - The value of the column.(optional)
 * @returns {Promise<object[]>} - The data related to the view.
 */
export const getViewData = async (
    viewName: string,
    column: string | undefined,
    value: string | undefined
): Promise<object[] | []> => {
    // Validate the view name
    const validatedViewName = viewValidationZod.parse(viewName);

    // Initialize the query parameters
    let params: Params = {
        column: 1,
        value: 1,
    };

    // Check if the column and value parameters are defined
    // otherwise keep the previously initialized values
    if (column && value) {
        if (Number.isNaN(Number(value))) throw new Error("Invalid value field");

        const parsedViewName = columnValidation.parse(column);

        params = {
            column: parsedViewName,
            value: Number(value),
        };
    }

    // Get the query builder function for the view from the view map
    // with the validated view name
    const queryBuilder = viewMap.get(validatedViewName);
    if (!queryBuilder) throw new Error("Invalid view name");

    // Build the query
    const query = queryBuilder(params);

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
