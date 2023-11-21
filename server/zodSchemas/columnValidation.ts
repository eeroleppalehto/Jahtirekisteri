import { z } from "zod";

const columnList: string[] = [
    "jakoryhma.ryhma_id",
    "seurue_id",
    "kaadon_kasittely.kaato_id",
    "kaadon_kasittely.kasittelyid",
];

const validateColumn = (column: string) => {
    if (columnList.includes(column)) {
        return true;
    } else {
        return false;
    }
};

export const columnValidation = z
    .string()
    .refine(validateColumn, { message: "Invalid column parameter" });
