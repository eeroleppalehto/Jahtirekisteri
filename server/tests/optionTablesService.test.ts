// Import necessary dependencies
import {
    getAllAikuinenvasa,
    getAllElain,
    getAllKasittely,
    getAllRuhonosa,
    getAllSukupuoli,
    getAllSeurueTyyppi
} from '../services/optionTablesService';
import { prismaMock } from '../singleton';

// Mock the Prisma client
jest.mock('../client', () => ({
    prisma: {
        $queryRawUnsafe: jest.fn(),
    },
}));

// Define tests
describe('optionTablesService tests', () => {
    it('should retrieve all aikuinenvasa records', async () => {
        const mockData = [{ ikaluokka: 'Aikuinen' }, { ikaluokka: 'Nuori' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllAikuinenvasa();
        expect(data).toEqual(mockData);
    });

    it('should retrieve all elain records', async () => {
        const mockData = [{ elaimen_nimi: 'Hirvi' }, { elaimen_nimi: 'Peura' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllElain();
        expect(data).toEqual(mockData);
    });

    it('should retrieve all kasittely records', async () => {
        const mockData = [{ kasittely_teksti: 'Pakastus' }, { kasittely_teksti: 'Savustus' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllKasittely();
        expect(data).toEqual(mockData);
    });

    it('should retrieve all ruhonosa records', async () => {
        const mockData = [{ osnimitys: 'Lapa' }, { osnimitys: 'Sisäfile' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllRuhonosa();
        expect(data).toEqual(mockData);
    });

    it('should retrieve all sukupuoli records', async () => {
        const mockData = [{ sukupuoli: 'Uros' }, { sukupuoli: 'Naaras' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllSukupuoli();
        expect(data).toEqual(mockData);
    });

    it('should retrieve all seurue_tyyppi records', async () => {
        const mockData = [{ seurue_tyyppi_nimi: 'Tyyppi 1' }, { seurue_tyyppi_nimi: 'Tyyppi 2' }];
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        const data = await getAllSeurueTyyppi();
        expect(data).toEqual(mockData);
    });
});
