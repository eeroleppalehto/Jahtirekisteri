import prisma from "../client";
import { kaatoInput } from "../zodSchemas/kaatoZod";
import { kaadonkasittelySchemaOnlyKasittely } from "../zodSchemas/kaadonkasittelyZod";

export const createShotUsage = async (data: unknown) => {
    // Check that the data is an object
    if (!data || typeof data !== "object") {
        throw new Error("Incorrect or missing data");
    }

    // Check that the data contains the required fields
    if (!("shot" in data && "usages" in data)) {
        throw new Error("Body must contain shot and usages fields");
    }

    // Check that the usages field is an array
    if (!(data.usages instanceof Array))
        throw new Error("Usages must be an array");

    // Use zod to validate the data
    const shot = kaatoInput.parse(data.shot);
    const usages = data.usages.map((usage) =>
        kaadonkasittelySchemaOnlyKasittely.parse(usage)
    );

    // Check that the usages array is not empty and throw an error if it is
    if (usages.length === 0) throw new Error("No usages provided");

    // Create the shot usage in the database
    const shotUsage = await prisma.kaato.create({
        data: {
            ...shot,
            kaadon_kasittely: {
                create: usages,
            },
        },
    });

    return shotUsage;
};
