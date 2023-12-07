import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById,
    getAllKaadonkasittelyt
} from '../services/kaadonkasittelyService';
import { prismaMock } from '../singleton';

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

describe('kaadonkasittelyService tests', () => {
    it('should create a new Kaadonkasittely', async () => {
        const kaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        prismaMock.kaadon_kasittely.create.mockResolvedValue(kaadonkasittelyData);
        const result = await createKaadonkasittely(kaadonkasittelyData);
        expect(result).toEqual(kaadonkasittelyData);
    });

    it('should read a Kaadonkasittely by ID', async () => {
        const kaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        prismaMock.kaadon_kasittely.findUnique.mockResolvedValue(kaadonkasittelyData);
        const result = await readKaadonkasittelyById(1);
        expect(result).toEqual(kaadonkasittelyData);
    });

    it('should update a Kaadonkasittely by ID', async () => {
        const updatedKaadonkasittelyData = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 20
        };

        prismaMock.kaadon_kasittely.update.mockResolvedValue(updatedKaadonkasittelyData);
        const result = await updateKaadonkasittelyById(1, updatedKaadonkasittelyData);
        expect(result).toEqual(updatedKaadonkasittelyData);
    });

    it('should delete a Kaadonkasittely by ID', async () => {
        const mockDeleteResponse = {
            kaadon_kasittely_id: 1,
            kasittelyid: 1,
            kaato_id: 2,
            kasittely_maara: 10
        };

        prismaMock.kaadon_kasittely.delete.mockResolvedValue(mockDeleteResponse);
        const result = await deleteKaadonkasittelyById(1);
        expect(result).toEqual(mockDeleteResponse);
    });

    it('should return all Kaadonkasittely', async () => {
        const mockKaadonkasittelyList = [
            { kaadon_kasittely_id: 1, kasittelyid: 1, kaato_id: 2, kasittely_maara: 10 },
            { kaadon_kasittely_id: 2, kasittelyid: 1, kaato_id: 3, kasittely_maara: 15 }
        ];

        prismaMock.kaadon_kasittely.findMany.mockResolvedValue(mockKaadonkasittelyList);
        const result = await getAllKaadonkasittelyt();
        expect(result).toEqual(mockKaadonkasittelyList);
    });
});
