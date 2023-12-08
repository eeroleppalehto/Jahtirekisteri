import {
    createJakoryhma,
    getAllJakoryhma,
    readJakoryhma,
    updateJakoryhma,
    deleteJakoryhma
} from '../services/jakoryhmaService';
import { prismaMock } from '../singleton';
  
// Mocking the Prisma client for isolated testing
jest.mock('../client', () => ({
    prisma: {
        jakoryhma: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));
  
describe('jakoryhmaService tests', () => {
    // Test for creating a new hunting group
    it('should create a new Jakoryhma', async () => {
        const jakoryhmaData = {
            ryhma_id: 1,
            seurue_id: 123, // Required field for identifying the associated hunting party
            ryhman_nimi: 'Testiryhmä',
        };
  
        prismaMock.jakoryhma.create.mockResolvedValue(jakoryhmaData);
        const result = await createJakoryhma(jakoryhmaData);
        expect(result).toEqual(jakoryhmaData);
    });
  
    // Test for retrieving all hunting groups
    it('should return all Jakoryhma', async () => {
        const mockJakoryhmaList = [
            { ryhma_id: 1, seurue_id: 123, ryhman_nimi: 'Ryhmä 1' },
            { ryhma_id: 2, seurue_id: 124, ryhman_nimi: 'Ryhmä 2' },
        ];
  
        prismaMock.jakoryhma.findMany.mockResolvedValue(mockJakoryhmaList);
        const jakoryhmat = await getAllJakoryhma();
        expect(jakoryhmat).toEqual(mockJakoryhmaList);
    });
  
    // Test for reading a specific hunting group by its ID
    it('should read a single Jakoryhma by ID', async () => {
        const mockJakoryhma = { ryhma_id: 1, seurue_id: 123, ryhman_nimi: 'Ryhmä 1' };
  
        prismaMock.jakoryhma.findUnique.mockResolvedValue(mockJakoryhma);
        const jakoryhma = await readJakoryhma(1);
        expect(jakoryhma).toEqual(mockJakoryhma);
    });
  
    // Test for updating a specific hunting group by its ID
    it('should update a Jakoryhma by ID', async () => {
        const updatedJakoryhmaData = {
            seurue_id: 123, // Confirming seurue_id is included in the update
            ryhman_nimi: 'Muokattu ryhmä',
        };
  
        const updatedJakoryhma = {
            ryhma_id: 1,
            ...updatedJakoryhmaData,
        };
  
        prismaMock.jakoryhma.update.mockResolvedValue(updatedJakoryhma);
        const result = await updateJakoryhma(1, updatedJakoryhmaData);
        expect(result).toEqual(updatedJakoryhma);
    });
  
    // Test for deleting a specific hunting group by its ID
    it('should delete a Jakoryhma by ID', async () => {
        const mockDeleteResponse = { ryhma_id: 1, seurue_id: 123, ryhman_nimi: 'Poistettu ryhmä' };
  
        prismaMock.jakoryhma.delete.mockResolvedValue(mockDeleteResponse);
        const result = await deleteJakoryhma(1);
        expect(result).toEqual(mockDeleteResponse);
    });
});
