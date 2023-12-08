import jakotapahtumaZod from "../zodSchemas/jakotapahtumaZod";

describe("Jakotapahtuma Validation", () => {
    // Testing valid 'osnimitys' values with Date objects
    test.each(["Koko", "Puolikas", "Neljännes"])(
        'valid osnimitys "%s"',
        (osnimitys) => {
            const validEvent = {
                tapahtuma_id: 1,
                paiva: new Date().toISOString(), // Directly using Date object
                ryhma_id: 1,
                osnimitys,
                kaadon_kasittely_id: 1,
                maara: 10,
            };
            const result = jakotapahtumaZod.safeParse(validEvent);
            expect(result.success).toBe(true);
        }
    );

    // Testing invalid 'osnimitys' values.
    // Ensures that any other value for 'osnimitys' is rejected.
    test.each(["Invalid", "Random", ""])(
        'invalid osnimitys "%s"',
        (osnimitys) => {
            const invalidEvent = {
                tapahtuma_id: 1,
                paiva: new Date().toISOString(),
                ryhma_id: 1,
                osnimitys: osnimitys, // Invalid portion name
                kaadon_kasittely_id: 1,
                maara: 10,
            };
            const result = jakotapahtumaZod.safeParse(invalidEvent);
            expect(result.success).toBe(false);
        }
    );

    // Test case to validate the date format.
    // Ensures that 'paiva' contains a valid date string.
    test("invalid date format", () => {
        const invalidEvent = {
            paiva: "invalid-date", // Incorrect date format
            ryhma_id: 1,
            osnimitys: "Koko",
            kaadon_kasittely_id: 1,
            maara: 10,
        };
        const result = jakotapahtumaZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });

    // Test cases for validating integer values in fields.
    // Checks that the integer fields contain valid and positive integers.
    test.each([
        { field: "tapahtuma_id", value: -1 }, // Negative values for IDs
        { field: "ryhma_id", value: -1 },
        { field: "kaadon_kasittely_id", value: -1 },
        { field: "maara", value: -1 }, // Negative value for quantity
    ])("invalid integer value for field %s", ({ field, value }) => {
        const invalidEvent = {
            paiva: new Date().toISOString(),
            osnimitys: "Koko",
            [field]: value, // Dynamically checking each field
        };
        const result = jakotapahtumaZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });

    // Test cases for data type validation of fields.
    // Ensures that each field has the correct data type.
    test.each([
        { field: "tapahtuma_id", value: "not-a-number" }, // Non-numeric values for integer fields
        { field: "ryhma_id", value: "not-a-number" },
        { field: "kaadon_kasittely_id", value: "not-a-number" },
        { field: "maara", value: "not-a-number" }, // Non-numeric value for quantity
    ])("invalid data type for field %s", ({ field, value }) => {
        const invalidEvent = {
            paiva: new Date().toISOString(),
            osnimitys: "Koko",
            [field]: value, // Testing incorrect data types
        };
        const result = jakotapahtumaZod.safeParse(invalidEvent);
        expect(result.success).toBe(false);
    });
});
