import { getViewData } from '../services/apiViewService';
import { prismaMock } from '../singleton';

// Mocking the database client
jest.mock('../client', () => ({
    prisma: {
        $queryRawUnsafe: jest.fn(),
    },
}));

describe('apiViewService tests', () => {
    // Test for retrieving view data without any filters
    it('should get view data without filters', async () => {
        // Define the view name to be tested
        const viewName = 'jakoryhma_osuus_maara';
        // Mock data to be returned for the test
        const mockData = [
            { ryhma_id: 1, osuus_summa: 50 },
            { ryhma_id: 2, osuus_summa: 75 }
        ];

        // Mock the database response
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        // Call the function with the view name and no filters
        const result = await getViewData(viewName, undefined, undefined);
        // Assert that the result matches the mock data
        expect(result).toEqual(mockData);
    });

    // Test for retrieving view data with valid filters
    it('should get view data with valid filters', async () => {
        // Define the view name and filter parameters
        const viewName = 'seurue_lihat';
        const column = 'seurue_id';
        const value = '100';  // String type for consistency with database
        // Mock data to be returned for this test
        const mockData = [
            { seurue_id: 100, lihan_maara: 200 }
        ];

        // Mock the database response
        prismaMock.$queryRawUnsafe.mockResolvedValue(mockData);
        // Call the function with the view name and filter parameters
        const result = await getViewData(viewName, column, value);
        // Assert that the result matches the mock data
        expect(result).toEqual(mockData);
    });

    // Test for handling invalid view name
    it('should throw error for invalid view name', async () => {
        // Define the invalid view name and filter parameters
        const viewName = 'invalidView';
        const column = 'seurue_id';
        const value = '100';

        // Assert that an error is thrown for the invalid view name
        await expect(getViewData(viewName, column, value))
            .rejects.toThrow("Invalid view"); // Updated to match the actual error message
    });

    // Test for handling invalid column name
    it('should throw error for invalid column name', async () => {
        // Define the view name and invalid column name
        const viewName = 'jakoryhma_osuus_maara';
        const column = 'invalidColumn';
        const value = '100';  // String type for consistency

        // Assert that an error is thrown for the invalid column name
        await expect(getViewData(viewName, column, value))
            .rejects.toThrow("Invalid column parameter");
    });

    // Test for handling invalid column value
    it('should throw error for invalid column value', async () => {
        // Define the view name, column name, and invalid value
        const viewName = 'seurue_lihat';
        const column = 'seurue_id';
        const value = 'invalidValue'; // Retained as a string for consistency

        // Assert that an error is thrown for the invalid column value
        await expect(getViewData(viewName, column, value))
            .rejects.toThrow("Invalid value field");
    });
});
