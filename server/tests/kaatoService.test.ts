import kaatoService from '../services/kaatoService';
import { prismaMock } from '../singleton';

// Mocking the Prisma client module
jest.mock('../client', () => ({
    prisma: {
        kaato: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

// Describe block for kaatoService tests
describe('kaatoService tests', () => {
    // Test case for retrieving all kaato records
    it('should retrieve all kaato records', async () => {
        // Mock data for kaato records
        const mockKaatoList = [
            // Mock kaato record 1
            { kaato_id: 1, jasen_id: 123, kaatopaiva: new Date(), ruhopaino: 40, paikka_teksti: 'Metsä', paikka_koordinaatti: '60.1234, 25.1234', elaimen_nimi: 'Hirvi', sukupuoli: 'Uros', ikaluokka: 'Aikuinen', lisatieto: 'Ei lisätietoja' },
            // Mock kaato record 2
            { kaato_id: 2, jasen_id: 124, kaatopaiva: new Date(), ruhopaino: 35, paikka_teksti: 'Niitty', paikka_koordinaatti: '60.5678, 25.5678', elaimen_nimi: 'Peura', sukupuoli: 'Naaras', ikaluokka: 'Nuori', lisatieto: 'Ei lisätietoja' },
        ];

        // Mocking Prisma findMany method
        prismaMock.kaato.findMany.mockResolvedValue(mockKaatoList);
        // Executing service method
        const kaadot = await kaatoService.getAllKaato();
        // Expecting returned data to match mock data
        expect(kaadot).toEqual(mockKaatoList);
    });

    // Test case for creating a new kaato
    it('should create a new kaato', async () => {
        // Data for new kaato
        const newKaatoData = {
            jasen_id: 125,
            kaatopaiva: new Date().toISOString(),
            ruhopaino: 45,
            paikka_teksti: 'Joki',
            paikka_koordinaatti: '60.1234, 25.6789',
            elaimen_nimi: 'Kauris',
            sukupuoli: 'Uros',
            ikaluokka: 'Aikuinen',
            lisatieto: 'Pieni sarvi'
        };

        // Expected created kaato object
        const createdKaato = {
            kaato_id: 3,
            ...newKaatoData,
            kaatopaiva: new Date(newKaatoData.kaatopaiva)
        };

        // Mocking Prisma create method
        prismaMock.kaato.create.mockResolvedValue(createdKaato);
        // Executing service method
        const result = await kaatoService.createKaato(newKaatoData);
        // Expecting returned data to match created kaato
        expect(result).toEqual(createdKaato);
    });

    // Test case for updating a kaato record
    it('should update a kaato record', async () => {
        // Data for updating kaato
        const updateData = {
            jasen_id: 123,
            kaatopaiva: new Date().toISOString(),
            ruhopaino: 50,
            paikka_teksti: 'Kukkula',
            paikka_koordinaatti: '60.1234, 25.1234',
            elaimen_nimi: 'Hirvi',
            sukupuoli: 'Uros',
            ikaluokka: 'Aikuinen',
            lisatieto: 'Iso sarvi'
        };

        // Expected updated kaato object
        const updatedKaato = {
            kaato_id: 1,
            ...updateData,
            kaatopaiva: new Date(updateData.kaatopaiva)
        };

        // Mocking Prisma update method
        prismaMock.kaato.update.mockResolvedValue(updatedKaato);
        // Executing service method
        const result = await kaatoService.updateKaato(1, updateData);
        // Expecting returned data to match updated kaato
        expect(result).toEqual(updatedKaato);
    });

    // Test case for deleting a kaato record
    it('should delete a kaato record', async () => {
        // Mock deleted kaato object
        const deletedKaato = {
            kaato_id: 2,
            jasen_id: 124,
            kaatopaiva: new Date(),
            ruhopaino: 35,
            paikka_teksti: 'Niitty',
            paikka_koordinaatti: '60.5678, 25.5678',
            elaimen_nimi: 'Peura',
            sukupuoli: 'Naaras',
            ikaluokka: 'Nuori',
            lisatieto: 'Ei lisätietoja'
        };

        // Mocking Prisma delete method
        prismaMock.kaato.delete.mockResolvedValue(deletedKaato);
        // Executing service method
        const result = await kaatoService.deleteKaato(2);
        // Expecting returned data to match deleted kaato
        expect(result).toEqual(deletedKaato);
    });
});
