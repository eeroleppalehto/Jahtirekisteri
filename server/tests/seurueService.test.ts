import {
    createSeurue,
    readSeurueById,
    updateSeurueById,
    deleteSeurueById,
    getAllSeurueet
} from '../services/seurueService';
import { prismaMock } from '../singleton';

// Mocking the Prisma client to avoid real database operations
jest.mock('../client', () => ({
    prisma: {
        seurue: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('seurueService tests', () => {
    // Test case for creating a new Seurue (hunting party)
    it('should create a new Seurue', async () => {
        const newSeurueData = {
            seura_id: 1, // Association ID
            seurueen_nimi: 'Metsästäjät', // Hunting party name
            jasen_id: 100, // Member ID
            seurue_tyyppi_id: 1 // Type of hunting party
        };

        const createdSeurue = {
            seurue_id: 1, // Auto-generated ID for the new Seurue
            ...newSeurueData
        };

        prismaMock.seurue.create.mockResolvedValue(createdSeurue);
        const result = await createSeurue(newSeurueData);
        expect(result).toEqual(createdSeurue);
    });

    // Test case for retrieving all Seurueet (hunting parties)
    it('should retrieve all Seurueet', async () => {
        const mockSeurueList = [
            // Mock data for Seurueet
            { seurue_id: 1, seura_id: 1, seurueen_nimi: 'Metsästäjät', jasen_id: 100, seurue_tyyppi_id: 1 },
            { seurue_id: 2, seura_id: 2, seurueen_nimi: 'Eräkävijät', jasen_id: 101, seurue_tyyppi_id: 2 }
        ];

        prismaMock.seurue.findMany.mockResolvedValue(mockSeurueList);
        const seurueet = await getAllSeurueet();
        expect(seurueet).toEqual(mockSeurueList);
    });

    // Test case for retrieving a Seurue by its ID
    it('should retrieve a Seurue by its ID', async () => {
        const mockSeurue = { seurue_id: 1, seura_id: 1, seurueen_nimi: 'Metsästäjät', jasen_id: 100, seurue_tyyppi_id: 1 };

        prismaMock.seurue.findUnique.mockResolvedValue(mockSeurue);
        const seurue = await readSeurueById(1);
        expect(seurue).toEqual(mockSeurue);
    });

    // Test case for updating a Seurue
    it('should update a Seurue', async () => {
        const updateData = {
            seura_id: 1, // Association ID, required field
            jasen_id: 100, // Member ID, required field
            seurue_tyyppi_id: 1, // Type ID, required field
            seurueen_nimi: 'Uudistetut Metsästäjät' // New hunting party name
        };

        const updatedSeurue = {
            seurue_id: 1, // ID of the Seurue being updated
            ...updateData
        };

        prismaMock.seurue.update.mockResolvedValue(updatedSeurue);
        const result = await updateSeurueById(1, updateData);
        expect(result).toEqual(updatedSeurue);
    });

    // Test case for deleting a Seurue
    it('should delete a Seurue', async () => {
        const deletedSeurue = { seurue_id: 2, seura_id: 2, seurueen_nimi: 'Eräkävijät', jasen_id: 101, seurue_tyyppi_id: 2 };

        prismaMock.seurue.delete.mockResolvedValue(deletedSeurue);
        const result = await deleteSeurueById(2);
        expect(result).toEqual(deletedSeurue);
    });
});
