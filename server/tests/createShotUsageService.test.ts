import { createShotUsage } from '../services/createShotUsageService';
import { prismaMock } from '../singleton';

// Mocking the Prisma client's 'kaato' module
jest.mock('../client', () => ({
    prisma: {
        kaato: {
            create: jest.fn(), // Mock implementation of the 'create' function
        },
    },
}));

// Describe block defines the test suite for the createShotUsageService
describe('createShotUsageService tests', () => {
    // Test case for successful creation of a new shot usage
    it('should create a new shot usage with valid data', async () => {
        // Define new shot data for the test
        const newShotData = {
            shot: {
                jasen_id: 123,
                kaatopaiva: new Date().toISOString(),
                ruhopaino: 100,
                paikka_teksti: "Metsäalue",
                paikka_koordinaatti: "60.12345,24.12345",
                elaimen_nimi: "Hirvi",
                sukupuoli: "Uros",
                ikaluokka: "Aikuinen",
                lisatieto: "Ei lisätietoja"
            },
            usages: [
                {
                    kasittelyid: 1,
                    kasittely_maara: 2
                },
                {
                    kasittelyid: 2,
                    kasittely_maara: 1
                }
            ]
        };

        // Define the expected response to match the service's output
        const expectedResponse = {
            kaato_id: 1,
            jasen_id: 123,
            kaatopaiva: new Date(),
            ruhopaino: 100,
            paikka_teksti: "Metsäalue",
            paikka_koordinaatti: "60.12345,24.12345",
            elaimen_nimi: "Hirvi",
            sukupuoli: "Uros",
            ikaluokka: "Aikuinen",
            lisatieto: "Ei lisätietoja",
            kaadon_kasittely: []
        };

        // Mock the response from the create function
        prismaMock.kaato.create.mockResolvedValue(expectedResponse);

        // Execute the service function and assert the expected response
        const result = await createShotUsage(newShotData);
        expect(result).toEqual(expectedResponse);
    });

    // Test case for handling invalid data structure
    it('should throw an error for invalid data structure', async () => {

        // Define invalid data for testing
        const invalidData = {};

        // Expect the service to throw an error for invalid data structure
        await expect(createShotUsage(invalidData))
            .rejects.toThrow("Body must contain shot and usages fields");
    });

    // Test case for handling missing required fields
    it('should throw an error for missing shot and usages fields', async () => {
        // Define data missing required fields for testing
        const missingFieldsData = { invalidField: "test" };

        // Expect the service to throw an error for missing required fields
        await expect(createShotUsage(missingFieldsData))
            .rejects.toThrow("Body must contain shot and usages fields");
    });

    // Test case for usages field not being an array
    it('should throw an error for non-array usages', async () => {
        // Define data where usages is not an array
        const nonArrayUsagesData = {
            shot: {
                jasen_id: 123,
                kaatopaiva: new Date().toISOString(),
                ruhopaino: 100,
                paikka_teksti: "Metsäalue",
                paikka_koordinaatti: "60.12345,24.12345",
                elaimen_nimi: "Hirvi",
                sukupuoli: "Uros",
                ikaluokka: "Aikuinen",
                lisatieto: "Ei lisätietoja"
            },
            usages: "not an array"
        };

        // Expect the service to throw an error for non-array usages
        await expect(createShotUsage(nonArrayUsagesData))
            .rejects.toThrow("Usages must be an array");
    });

    // Test case for empty usages array
    it('should throw an error for empty usages array', async () => {
        const emptyUsagesData = {
            shot: {
                jasen_id: 123,
                kaatopaiva: new Date().toISOString(),
                ruhopaino: 100,
                paikka_teksti: "Metsäalue",
                paikka_koordinaatti: "60.12345,24.12345",
                elaimen_nimi: "Hirvi",
                sukupuoli: "Uros",
                ikaluokka: "Aikuinen",
                lisatieto: "Ei lisätietoja"
            },
            usages: []
        };

        // Expect the service to throw an error for an empty usages array
        await expect(createShotUsage(emptyUsagesData))
            .rejects.toThrow("No usages provided");
    });

});
