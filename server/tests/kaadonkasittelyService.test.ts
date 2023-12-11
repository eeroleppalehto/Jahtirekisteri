import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById,
    getAllKaadonkasittelyt
} from '../services/kaadonkasittelyService';
import { prismaMock } from '../singleton';

// Mocking Prisma client to test the Kaadonkasittely service functions
jest.mock('../client', () => ({
    prisma: {
        kaadon_kasittely: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

// Grouping tests for Kaadonkasittely service functions
describe('kaadonkasittelyService tests', () => {
    // Test case for creating a new Kaadonkasittely
    it('should create a new Kaadonkasittely', async () => {
        // Define mock data for Kaadonkasittely
        const kaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        // Mock the response for Prisma create method
        prismaMock.kaadon_kasittely.create.mockResolvedValue(kaadonkasittelyData);

        // Call the createKaadonkasittely service function with mock data
        const result = await createKaadonkasittely(kaadonkasittelyData);

        // Assert that the returned data matches the expected result
        expect(result).toEqual(kaadonkasittelyData);
    });

    // Test case for reading a Kaadonkasittely by ID
    it('should read a Kaadonkasittely by ID', async () => {
        // Define mock data for Kaadonkasittely
        const kaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        // Mock the response for Prisma findUnique method
        prismaMock.kaadon_kasittely.findUnique.mockResolvedValue(kaadonkasittelyData);

        // Call the readKaadonkasittelyById service function with mock ID
        const result = await readKaadonkasittelyById(1);

        // Assert that the returned data matches the expected result
        expect(result).toEqual(kaadonkasittelyData);
    });

    // Test case for updating a Kaadonkasittely by ID
    it('should update a Kaadonkasittely by ID', async () => {
        // Define mock data for the updated Kaadonkasittely
        const updatedKaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 20
        };

        // Mock the response for Prisma update method
        prismaMock.kaadon_kasittely.update.mockResolvedValue(updatedKaadonkasittelyData);

        // Call the updateKaadonkasittelyById service function with mock data
        const result = await updateKaadonkasittelyById(1, updatedKaadonkasittelyData);

        // Assert that the returned data matches the expected result
        expect(result).toEqual(updatedKaadonkasittelyData);
    });

    // Test case for deleting a Kaadonkasittely by ID
    it('should delete a Kaadonkasittely by ID', async () => {
        // Define mock response for delete operation
        const mockDeleteResponse = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        // Mock the response for Prisma delete method
        prismaMock.kaadon_kasittely.delete.mockResolvedValue(mockDeleteResponse);

        // Call the deleteKaadonkasittelyById service function with mock ID
        const result = await deleteKaadonkasittelyById(1);

        // Assert that the returned data matches the expected result
        expect(result).toEqual(mockDeleteResponse);
    });

    // Test case for retrieving all Kaadonkasittely records
    it('should return all Kaadonkasittely', async () => {
        // Define mock list of Kaadonkasittely records
        const mockKaadonkasittelyList = [
            { kaadon_kasittely_id: 1, kasittelyid: 1, kaato_id: 2, kasittely_maara: 10 },
            { kaadon_kasittely_id: 2, kasittelyid: 1, kaato_id: 3, kasittely_maara: 15 }
        ];

        // Mock the response for Prisma findMany method
        prismaMock.kaadon_kasittely.findMany.mockResolvedValue(mockKaadonkasittelyList);

        // Call the getAllKaadonkasittelyt service function
        const result = await getAllKaadonkasittelyt();

        // Assert that the returned data matches the expected list
        expect(result).toEqual(mockKaadonkasittelyList);
    });
});
