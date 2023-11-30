import viewValidationZod from '../zodSchemas/viewValidationZod';
import { viewMap } from '../utils/viewMap';

describe('View Validation', () => {
    // Tests to verify that all valid view names in the viewMap are accepted by the schema.
    // This ensures that the schema recognizes all defined views as valid.
    test.each(Array.from(viewMap.keys()))('should accept valid view "%s"', (viewName) => {
        const result = viewValidationZod.safeParse(viewName);
        expect(result.success).toBe(true);
    });

    // Tests to ensure that invalid view names or potential SQL injections are rejected.
    // This is crucial for security, preventing SQL injection attacks.
    // You can add more examples of invalid view names or potential SQL injection strings to further test the robustness.
    test.each([
        'randomView', // Example of a random, undefined view name
        'nonexistentView', // Example of a non-existent view name
        'invalidView', // Example of an invalid view name
        'DROP TABLE users;',  // Testing SQL injection: A malicious SQL command
        '; DELETE * FROM users;'  // Testing another form of SQL injection
    ])('should reject invalid view "%s"', (viewName) => {
        const result = viewValidationZod.safeParse(viewName);
        expect(result.success).toBe(false);
    });

});
