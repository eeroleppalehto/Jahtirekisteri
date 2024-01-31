import { z } from "zod";

// A list of allowed column names for validation
const columnList: string[] = [
    "jakoryhma.ryhma_id", // Column name in 'jakoryhma' table
    "seurue_id", // Column name for 'seurue' ID
    "kaadon_kasittely.kaato_id", // Column name in 'kaadon_kasittely' table
    "kaadon_kasittely.kasittelyid", // Another column in 'kaadon_kasittely'
    "seurue.seurue_id", // Column name in 'seurue' table
];

// Function to validate if a given column name is valid
const validateColumn = (column: string) => {
    // Checks if the provided column name exists in the columnList array
    return columnList.includes(column);
};

// Zod schema to validate column names
// This is used to ensure only valid column names are processed, preventing SQL injection
export const columnValidation = z
    .string() // The input should be a string
    .refine(validateColumn, { message: "Invalid column parameter" }); // Refine to use custom validation function
