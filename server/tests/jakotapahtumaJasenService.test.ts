import {
    createJakotapahtumaJasen,
    readJakotapahtumaJasenById,
    updateJakotapahtumaJasenById,
    deleteJakotapahtumaJasenById,
    getAllJakotapahtumaJasen,
} from "../services/jakotapahtumaJasenService";
import { prismaMock } from "../singleton";

// Mocking the Prisma client to prevent actual database operations in tests
jest.mock("../client", () => ({
    prisma: {
        jakotapahtuma_jasen: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe("jakotapahtumaJasenService tests", () => {
    // Test case for creating a new JakotapahtumaJasen
    it("should create a new JakotapahtumaJasen", async () => {
        const jakotapahtumaJasenData = {
            tapahtuma_jasen_id: 1,
            paiva: new Date(), // Date object representing the event date
            jasenyys_id: 100, // Numeric ID for the jasenyys (membership)
            osnimitys: "Koko", // Short description or title
            kaadon_kasittely_id: 101, // Numeric ID for the processing event
            maara: 5, // Quantity or amount
        };

        prismaMock.jakotapahtuma_jasen.create.mockResolvedValue(
            jakotapahtumaJasenData
        );
        const result = await createJakotapahtumaJasen({
            ...jakotapahtumaJasenData,
            paiva: jakotapahtumaJasenData.paiva.toISOString(),
        });
        expect(result).toEqual(jakotapahtumaJasenData);
    });

    // Test case for reading a JakotapahtumaJasen by ID
    it("should read a JakotapahtumaJasen by ID", async () => {
        const jakotapahtumaJasenData = {
            tapahtuma_jasen_id: 1,
            paiva: new Date(),
            jasenyys_id: 100,
            osnimitys: "Koko",
            kaadon_kasittely_id: 101,
            maara: 5,
        };

        prismaMock.jakotapahtuma_jasen.findUnique.mockResolvedValue(
            jakotapahtumaJasenData
        );
        const result = await readJakotapahtumaJasenById(1);
        expect(result).toEqual(jakotapahtumaJasenData);
    });

    // Test case for updating a JakotapahtumaJasen by ID
    it("should update a JakotapahtumaJasen by ID", async () => {
        const updateData = {
            paiva: new Date(), // Retaining the original date
            jasenyys_id: 100, // Retaining the original membership ID
            kaadon_kasittely_id: 101, // Retaining the original processing event ID
            osnimitys: "Puolikas", // Updated description
            maara: 10, // Updated quantity
        };

        const updatedJakotapahtumaJasenData = {
            tapahtuma_jasen_id: 1,
            ...updateData,
        };

        prismaMock.jakotapahtuma_jasen.update.mockResolvedValue(
            updatedJakotapahtumaJasenData
        );
        const result = await updateJakotapahtumaJasenById(1, {
            ...updateData,
            paiva: updateData.paiva.toISOString(),
        });
        expect(result).toEqual(updatedJakotapahtumaJasenData);
    });

    // Test case for deleting a JakotapahtumaJasen by ID
    it("should delete a JakotapahtumaJasen by ID", async () => {
        const deleteResponse = {
            tapahtuma_jasen_id: 1,
            paiva: new Date(),
            jasenyys_id: 100,
            osnimitys: "Koko",
            kaadon_kasittely_id: 101,
            maara: 5,
        };

        prismaMock.jakotapahtuma_jasen.delete.mockResolvedValue(deleteResponse);
        const result = await deleteJakotapahtumaJasenById(1);
        expect(result).toEqual(deleteResponse);
    });

    // Test case for retrieving all JakotapahtumaJasen records
    it("should return all JakotapahtumaJasen", async () => {
        const allJakotapahtumaJasenData = [
            {
                tapahtuma_jasen_id: 1,
                paiva: new Date(),
                jasenyys_id: 100,
                osnimitys: "Koko",
                kaadon_kasittely_id: 101,
                maara: 5,
            },
            {
                tapahtuma_jasen_id: 2,
                paiva: new Date(),
                jasenyys_id: 101,
                osnimitys: "Puolikas",
                kaadon_kasittely_id: 102,
                maara: 3,
            },
        ];

        prismaMock.jakotapahtuma_jasen.findMany.mockResolvedValue(
            allJakotapahtumaJasenData
        );
        const result = await getAllJakotapahtumaJasen();
        expect(result).toEqual(allJakotapahtumaJasenData);
    });
});
