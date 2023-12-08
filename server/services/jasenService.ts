// jasenService.ts
import prisma from "../client"; // Import Prisma client for database operations
import { jasenInput } from "../zodSchemas/jasenZod"; // Import Zod schema for jasen input validation

/**
 * Service module for handling CRUD operations for 'jasen' table.
 * Utilizes Prisma ORM for database interactions and Zod for data validation.
 */

// Retrieve all 'jasen' records from the database
const getAllJasen = async () => {
    const jasenet = await prisma.jasen.findMany(); // Fetch all jasen records
    return jasenet;
};

// Create a new 'jasen' record in the database
const createJasen = async (object: unknown) => {
    const data = jasenInput.parse(object); // Validate input data using Zod schema
    const { etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila } = data;

    const jasen = await prisma.jasen.create({
        data: {
            etunimi,
            sukunimi,
            jakeluosoite,
            postinumero,
            postitoimipaikka,
            tila
        }
    });

    return jasen;
};

// Update an existing 'jasen' record by its unique ID
const updateJasen = async (id: number, object: unknown) => {
    const data = jasenInput.parse(object); // Validate and parse input data
    const { etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila } = data;

    const jasen = await prisma.jasen.update({
        where: { jasen_id: id },
        data: {
            etunimi,
            sukunimi,
            jakeluosoite,
            postinumero,
            postitoimipaikka,
            tila
        }
    });

    return jasen;
};

// Delete a 'jasen' record by its unique ID
const deleteJasen = async (id: number) => {
    const jasen = await prisma.jasen.delete({
        where: { jasen_id: id } // Specify the ID for deletion
    });

    return jasen;
};

// Export CRUD operations for external use
export default { getAllJasen, createJasen, updateJasen, deleteJasen };
