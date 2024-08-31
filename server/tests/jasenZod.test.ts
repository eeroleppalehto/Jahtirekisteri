import { jasenInput } from '../zodSchemas/jasenZod';

describe('Jasen Validation', () => {
    // Test for ensuring valid member data passes validation.
    test('valid member data', () => {
        const validMember = {
            etunimi: "Test", // Testing a valid first name
            sukunimi: "User", // Testing a valid last name
            jakeluosoite: "Test Address", // Testing a valid address
            postinumero: "12345", // Testing a valid postal code
            postitoimipaikka: "Test City", // Testing a valid city name
            puhelinnumero: "0401234567", // Testing a valid phone number
            tila: "aktiivinen" // Testing a valid status (active)
        };
        const result = jasenInput.safeParse(validMember);
        expect(result.success).toBe(true);
    });

    // Test for invalid 'tila' (status) values, ensuring only specific values are accepted.
    test.each(['inactive', 'removed', ''])('invalid tila "%s"', (tila) => {
        const invalidMember = {
            etunimi: "Test",
            sukunimi: "User",
            jakeluosoite: "Test Address",
            postinumero: "12345",
            postitoimipaikka: "Test City",
            puhelinnumero: "0401234567",
            tila: tila // Testing different invalid status values
        };
        const result = jasenInput.safeParse(invalidMember);
        expect(result.success).toBe(false);
    });

    // Testing character limits for 'etunimi' (first name), ensuring it doesn't exceed the maximum length.
    test('etunimi character limit', () => {
        const longNameMember = {
            etunimi: "T".repeat(51), // String exceeding character limit for first name
            sukunimi: "User",
            tila: "aktiivinen"
        };
        const result = jasenInput.safeParse(longNameMember);
        expect(result.success).toBe(false);
    });

    // Testing for optional fields, ensuring the validation passes when they are undefined.
    test('optional fields undefined', () => {
        const memberWithOptionalFields = {
            etunimi: "Test",
            sukunimi: "User",
            tila: "aktiivinen" // No optional fields provided
        };
        const result = jasenInput.safeParse(memberWithOptionalFields);
        expect(result.success).toBe(true);
    });

    // Testing data type validations for each field to ensure proper types are used.
    test('data type validations', () => {
        const invalidDataTypeMember = {
            etunimi: 123, // Incorrect data type for first name (number instead of string)
            sukunimi: "User",
            tila: "aktiivinen"
        };
        const result = jasenInput.safeParse(invalidDataTypeMember);
        expect(result.success).toBe(false);
    });

});
