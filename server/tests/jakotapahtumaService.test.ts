import {
    createJakotapahtuma,
    readJakotapahtumaById,
    updateJakotapahtumaById,
    deleteJakotapahtumaById,
    getAllJakotapahtumat
} from '../services/jakotapahtumaService';
import { prismaMock } from '../singleton';

// Mocking Prisma client to avoid actual database interaction during tests
jest.mock('../client', () => ({
    prisma: {
        jakotapahtuma: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('jakotapahtumaService tests', () => {
    // Test for creating a new Jakotapahtuma record
    it('should create a new Jakotapahtuma', async () => {
        const jakotapahtumaData = {
            tapahtuma_id: 1,
            paiva: new Date(), // Date object representing the event date
            ryhma_id: 101,     // Numeric ID for the group
            osnimitys: 'Koko', // Short description or title
            kaadon_kasittely_id: 201, // Numeric ID for the processing event
            maara: 5.0        // Numeric value indicating quantity
        };

        prismaMock.jakotapahtuma.create.mockResolvedValue(jakotapahtumaData);
        const result = await createJakotapahtuma(jakotapahtumaData);
        expect(result).toEqual(jakotapahtumaData);
    });

    // Test for reading a Jakotapahtuma record by ID
    it('should read a Jakotapahtuma by ID', async () => {
        const jakotapahtumaData = {
            tapahtuma_id: 1,
            paiva: new Date(),
            ryhma_id: 101,
            osnimitys: 'Koko',
            kaadon_kasittely_id: 201,
            maara: 5.0
        };

        prismaMock.jakotapahtuma.findUnique.mockResolvedValue(jakotapahtumaData);
        const result = await readJakotapahtumaById(1);
        expect(result).toEqual(jakotapahtumaData);
    });

    // Test for updating a Jakotapahtuma record by ID
    it('should update a Jakotapahtuma by ID', async () => {
        const updatedData = {
            paiva: new Date(), // Retaining the original date
            ryhma_id: 101,     // Retaining the original group ID
            kaadon_kasittely_id: 201, // Retaining the original processing event ID
            osnimitys: 'Puolikas',    // Updated description
            maara: 10.0               // Updated quantity
        };

        const updatedJakotapahtumaData = {
            tapahtuma_id: 1,
            ...updatedData
        };

        prismaMock.jakotapahtuma.update.mockResolvedValue(updatedJakotapahtumaData);
        const result = await updateJakotapahtumaById(1, updatedData);
        expect(result).toEqual(updatedJakotapahtumaData);
    });

    // Test for deleting a Jakotapahtuma record by ID
    it('should delete a Jakotapahtuma by ID', async () => {
        const deleteResponse = {
            tapahtuma_id: 1,
            paiva: new Date(),
            ryhma_id: 101,
            osnimitys: 'Koko',
            kaadon_kasittely_id: 201,
            maara: 5.0
        };

        prismaMock.jakotapahtuma.delete.mockResolvedValue(deleteResponse);
        const result = await deleteJakotapahtumaById(1);
        expect(result).toEqual(deleteResponse);
    });

    // Test for retrieving all Jakotapahtuma records
    it('should return all Jakotapahtumat', async () => {
        const allJakotapahtumatData = [
            {
                tapahtuma_id: 1,
                paiva: new Date(),
                ryhma_id: 101,
                osnimitys: 'Koko',
                kaadon_kasittely_id: 201,
                maara: 5.0
            },
            {
                tapahtuma_id: 2,
                paiva: new Date(),
                ryhma_id: 102,
                osnimitys: 'Puolikas',
                kaadon_kasittely_id: 202,
                maara: 3.0
            }
        ];

        prismaMock.jakotapahtuma.findMany.mockResolvedValue(allJakotapahtumatData);
        const result = await getAllJakotapahtumat();
        expect(result).toEqual(allJakotapahtumatData);
    });
});
