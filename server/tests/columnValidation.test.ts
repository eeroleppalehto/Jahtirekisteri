import { columnValidation } from '../zodSchemas/columnValidation';

describe('Column Validation', () => {
    // Tests to ensure that valid column names are correctly recognized.
    // This is important to verify that the validation logic accepts legitimate column names.
    test.each([
        'jakoryhma.ryhma_id', // testing a nested column name with dot notation
        'seurue_id',          // testing a simple column name
        'kaadon_kasittely.kaato_id', // testing another nested column name
        'kaadon_kasittely.kasittelyid', // yet another nested column name
        // Add other valid column names defined in the schema here
    ])('should accept valid column name "%s"', (columnName) => {
        const result = columnValidation.safeParse(columnName);
        expect(result.success).toBe(true);
    });

    // Tests to ensure that invalid column names are correctly rejected.
    // This includes checking for common SQL injection patterns to ensure security.
    test.each([
        'DROP TABLE users;', // SQL injection pattern
        '; DELETE * FROM users;', // Another SQL injection pattern
        '1=1', // Common SQL injection condition
        'nonexistent_column', // A column name that doesn't exist
        // Add other invalid column names or SQL injections here
    ])('should reject invalid column name "%s"', (columnName) => {
        const result = columnValidation.safeParse(columnName);
        expect(result.success).toBe(false);
    });

    // Tests to check that only predefined column names are accepted.
    // This is to ensure that arbitrary, non-defined column names are not allowed.
    test.each([
        'random_column', // A column name that is not defined
        'another_fake_column', // Another undefined column name
        'some_random_text', // Random text that doesn't represent a column name
        // Add other tests for non-valid columns here
    ])('should reject non-listed column name "%s"', (columnName) => {
        const result = columnValidation.safeParse(columnName);
        expect(result.success).toBe(false);
    });
});
