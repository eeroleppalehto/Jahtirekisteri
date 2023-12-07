import {
    createLupa,
    readAllLupas,
    readLupaById,
    updateLupaById,
    deleteLupaById
} from '../services/lupaService';
import { prismaMock } from '../singleton';

// Mock the Prisma client's lupa model functions
jest.mock('../client', () => ({
    prisma: {
        lupa: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

// Describe the suite of tests for the lupaService
describe('lupaService tests', () => {
    // Test the creation of a new lupa record
    it('should create a new lupa record', async () => {
        // Define the new lupa data
        const newLupaData = {
            seura_id: 1,
            lupavuosi: '2023',
            elaimen_nimi: 'Hirvi',
            sukupuoli: 'Uros',
            ikaluokka: 'Aikuinen',
            maara: 5
        };

        // Expected result after creation
        const createdLupa = {
            luparivi_id: 1,
            ...newLupaData
        };

        // Mock the create function and test the creation
        prismaMock.lupa.create.mockResolvedValue(createdLupa);
        const result = await createLupa(newLupaData);
        expect(result).toEqual(createdLupa);
    });

    // Test retrieving all lupa records
    it('should retrieve all lupa records', async () => {
        // Mock data for lupa records
        const mockLupaList = [
            { luparivi_id: 1, seura_id: 1, lupavuosi: '2023', elaimen_nimi: 'Hirvi', sukupuoli: 'Uros', ikaluokka: 'Aikuinen', maara: 5 },
            { luparivi_id: 2, seura_id: 2, lupavuosi: '2022', elaimen_nimi: 'Peura', sukupuoli: 'Naaras', ikaluokka: 'Nuori', maara: 3 }
        ];

        // Mock the findMany function and test retrieving all records
        prismaMock.lupa.findMany.mockResolvedValue(mockLupaList);
        const lupas = await readAllLupas();
        expect(lupas).toEqual(mockLupaList);
    });

    // Test retrieving a specific lupa record by ID
    it('should retrieve a lupa record by ID', async () => {
        // Mock data for a specific lupa record
        const mockLupa = { luparivi_id: 1, seura_id: 1, lupavuosi: '2023', elaimen_nimi: 'Hirvi', sukupuoli: 'Uros', ikaluokka: 'Aikuinen', maara: 5 };

        // Mock the findUnique function and test retrieving by ID
        prismaMock.lupa.findUnique.mockResolvedValue(mockLupa);
        const lupa = await readLupaById(1);
        expect(lupa).toEqual(mockLupa);
    });

    // Test updating a lupa record
    it('should update a lupa record', async () => {
        // Define update data
        const updateData = {
            seura_id: 1,
            lupavuosi: '2023',
            elaimen_nimi: 'Hirvi',
            sukupuoli: 'Uros',
            ikaluokka: 'Aikuinen',
            maara: 6
        };

        // Expected result after update
        const updatedLupa = {
            luparivi_id: 1,
            ...updateData
        };

        // Mock the update function and test the update
        prismaMock.lupa.update.mockResolvedValue(updatedLupa);
        const result = await updateLupaById(1, updateData);
        expect(result).toEqual(updatedLupa);
    });

    // Test deleting a lupa record
    it('should delete a lupa record', async () => {
        // Mock data for the deletion response
        const deletedLupa = { luparivi_id: 2, seura_id: 2, lupavuosi: '2022', elaimen_nimi: 'Peura', sukupuoli: 'Naaras', ikaluokka: 'Nuori', maara: 3 };

        // Mock the delete function and test the deletion
        prismaMock.lupa.delete.mockResolvedValue(deletedLupa);
        const result = await deleteLupaById(2);
        expect(result).toEqual(deletedLupa);
    });
});
