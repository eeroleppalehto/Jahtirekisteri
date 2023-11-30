# Tests Directory Documentation

## Overview

This directory contains automated tests for the Jahtirekisteri application. The tests are designed to ensure the reliability and correctness of the application's functionality, particularly focusing on its backend services, database interactions, and data validation mechanisms.

### File Structure

- `jasenService.test.ts`: Contains tests for member management services including member creation, updating, deletion, and listing.
- `columnValidation.test.ts`: Tests the validation of column names to prevent SQL injection and ensure data integrity.
- `jakotapahtumaJasenZod.test.ts`: Tests the validation logic for jakotapahtumaJasen data model, including custom field validations.
- `jakotapahtumaZod.test.ts`: Focuses on the validation of jakotapahtuma data model and its fields.
- `jasenZod.test.ts`: Covers tests for the validation of jasen data model, ensuring all data types and constraints are correctly implemented.
- `viewValidationZod.test.ts`: Ensures that view names are validated correctly to prevent SQL injection and data breaches.

### Testing Framework and Tools

- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.
- **ts-jest**: A TypeScript preprocessor with source map support for Jest.
- **Prisma Client**: Used for database interactions in the tests.
- **Zod**: For robust data validation in tests.

### Running the Tests

To run the tests, navigate to the `server` directory and use the following command:

cd server
npm test

This command will execute all the tests in the tests directory and provide a report on their outcomes.

### Individual Test File Overviews

`columnValidation.test.ts` - Column Name Validation Tests
This file contains tests for validating column names within the Jahtirekisteri application. It focuses on preventing SQL injection and ensuring data integrity.

`jakotapahtumaJasenZod.test.ts` - JakotapahtumaJasen Validation Tests
Tests in this file are designed to validate the jakotapahtumaJasen data model, particularly focusing on custom field validations to ensure accuracy and integrity of the data.

`jakotapahtumaZod.test.ts` - Jakotapahtuma Validation Tests
This file focuses on validating the jakotapahtuma data model within the Jahtirekisteri application. It covers tests for all fields to ensure they adhere to expected formats and values.

`jasenZod.test.ts` - Jasen Data Model Validation Tests
The tests in this file cover the validation of the jasen data model. It ensures the correct implementation of data types, constraints, and custom validation logic.

`viewValidationZod.test.ts` - View Name Validation Tests
This file contains tests for validating view names in the Jahtirekisteri application. It aims to prevent SQL injection and data breaches through robust validation of view identifiers.

### Best Practices

Keep tests isolated: Each test should run independently without relying on the state created by previous tests.
Test for both expected and unexpected scenarios: Include edge cases and error handling in your tests.
Regularly update tests: As the application evolves, ensure that tests are updated to match the new functionalities and requirements.