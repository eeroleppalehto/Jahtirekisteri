import jakotapahtumaJasenZod from '../zodSchemas/jakotapahtumaJasenZod';

describe('JakotapahtumaJasen Validation', () => {
    // Testing valid 'osnimitys' values with correct date format (Date object)
    test.each(['Koko', 'Puolikas', 'Neljännes'])('valid osnimitys "%s"', (osnimitys) => {
        const validEvent = {
            tapahtuma_jasen_id: 1,
            paiva: new Date(), // Correct date format (Date object)
            jasenyys_id: 1,
            osnimitys,
            kaadon_kasittely_id: 1,
            maara: 10,
        };
        const result = jakotapahtumaJasenZod.safeParse(validEvent);
        expect(result.success).toBe(true);
    });

    // Test cases for invalid 'osnimitys' values.
    // Ensures that any value outside the expected ones are rejected.
    test.each(['Invalid', 'Random', ''])('invalid osnimitys "%s"', (osnimitys) => {
        const invalidEvent = {
            tapahtuma_jasen_id: 1,
            paiva: new Date().toISOString(),
            jasenyys_id: 1,
            osnimitys: osnimitys, // Testing for invalid portion names
            kaadon_kasittely_id: 1,
            maara: 10,
        };
        const result = jakotapahtumaJasenZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });

    // Test case to validate the date format.
    // Ensures that the 'paiva' field contains a valid date.
    test('invalid date format', () => {
        const invalidEvent = {
            paiva: "invalid-date", // Intentionally incorrect date format
            jasenyys_id: 1,
            osnimitys: 'Koko',
            kaadon_kasittely_id: 1,
            maara: 10,
        };
        const result = jakotapahtumaJasenZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });

    // Test cases for validating integer fields.
    // Ensures that numeric fields contain valid integer values.
    test.each([
        { field: 'jasenyys_id', value: "not-a-number" }, // Non-numeric value for an integer field
        { field: 'kaadon_kasittely_id', value: -1 }, // Negative value for an integer field
        { field: 'maara', value: "not-a-number" }, // Another non-numeric value
    ])('invalid integer value for field %s', ({ field, value }) => {
        const invalidEvent = {
            paiva: new Date().toISOString(),
            osnimitys: 'Koko',
            [field]: value, // Dynamically assigning field and value
        };
        const result = jakotapahtumaJasenZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });

});
