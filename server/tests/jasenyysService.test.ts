import {
    createJasenyys,
    readJasenyysById,
    updateJasenyysById,
    deleteJasenyysById,
    getAllJasenyydet,
} from "../services/jasenyysService";
import { prismaMock } from "../singleton";

// Mock Prisma client for unit testing
jest.mock("../client", () => ({
    prisma: {
        jasenyys: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe("jasenyysService tests", () => {
    // Test for creating a new Jasenyys record
    it("should create a new Jasenyys", async () => {
        const jasenyysData = {
            jasenyys_id: 1,
            seurue_id: 123,
            ryhma_id: 456,
            jasen_id: 789,
            osuus: 50,
            liittyi: new Date(), // Updated to a Date object
            poistui: new Date(), // Updated to a Date object
        };

        prismaMock.jasenyys.create.mockResolvedValue(jasenyysData);
        const result = await createJasenyys({
            ...jasenyysData,
            liittyi: jasenyysData.liittyi.toISOString(),
            poistui: jasenyysData.poistui.toISOString(),
        });
        expect(result).toEqual(jasenyysData);
    });

    // Test for reading a Jasenyys record by ID
    it("should read a Jasenyys by ID", async () => {
        const jasenyysData = {
            jasenyys_id: 1,
            seurue_id: 123,
            ryhma_id: 456,
            jasen_id: 789,
            osuus: 50,
            liittyi: new Date(), // Updated to a Date object
            poistui: new Date(), // Updated to a Date object
        };

        prismaMock.jasenyys.findUnique.mockResolvedValue(jasenyysData);
        const result = await readJasenyysById(1);
        expect(result).toEqual(jasenyysData);
    });

    // Test for updating a Jasenyys record by ID
    it("should update a Jasenyys by ID", async () => {
        const originalJasenyysData = {
            jasenyys_id: 1,
            seurue_id: 123,
            ryhma_id: 456,
            jasen_id: 789,
            osuus: 50,
            liittyi: new Date(),
            poistui: new Date(),
        };
        const updateData = {
            ...originalJasenyysData, // Retain original values
            osuus: 60, // Updated value
            poistui: new Date(), // Updated to a new Date object
        };

        prismaMock.jasenyys.update.mockResolvedValue(updateData);
        const result = await updateJasenyysById(1, {
            ...updateData,
            liittyi: updateData.liittyi.toISOString(),
            poistui: updateData.poistui.toISOString(),
        });
        expect(result).toEqual(updateData);
    });

    // Test for deleting a Jasenyys record by ID
    it("should delete a Jasenyys by ID", async () => {
        const deleteResponse = {
            jasenyys_id: 1,
            seurue_id: 123,
            ryhma_id: 456,
            jasen_id: 789,
            osuus: 50,
            liittyi: new Date(), // Updated to a Date object
            poistui: new Date(), // Updated to a Date object
        };

        prismaMock.jasenyys.delete.mockResolvedValue(deleteResponse);
        const result = await deleteJasenyysById(1);
        expect(result).toEqual(deleteResponse);
    });

    // Test for retrieving all Jasenyys records
    it("should return all Jasenyydet", async () => {
        const allJasenyydetData = [
            {
                jasenyys_id: 1,
                seurue_id: 123,
                ryhma_id: 456,
                jasen_id: 789,
                osuus: 50,
                liittyi: new Date(), // Updated to a Date object
                poistui: new Date(), // Updated to a Date object
            },
            {
                jasenyys_id: 2,
                seurue_id: 124,
                ryhma_id: 457,
                jasen_id: 790,
                osuus: 60,
                liittyi: new Date(), // Updated to a Date object
                poistui: new Date(), // Updated to a Date object
            },
        ];

        prismaMock.jasenyys.findMany.mockResolvedValue(allJasenyydetData);
        const result = await getAllJasenyydet();
        expect(result).toEqual(allJasenyydetData);
    });
});
