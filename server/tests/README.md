# Tests Directory Documentation

## Overview

This directory contains automated tests for the Jahtirekisteri application. The tests are designed to ensure the reliability and correctness of the application's functionality, particularly focusing on its backend services, database interactions, and data validation mechanisms.

### File Structure

- `apiViewService.test.ts`: Tests the API views service for correct functionality and response formats. Ensures API endpoints deliver expected data and handle errors properly.

- `columnValidation.test.ts`: Validates column names in database queries to prevent SQL injection and maintain data integrity. Ensures that column names are correctly formatted and secure.

- `createShotUsageService.test.ts`: Verifies the functionality of the service for recording and managing shot usages. Tests include creating, updating, and validating shot usage data.

- `jakoryhmaService.test.ts`: Focuses on testing the services related to hunting groups (jakoryhma). Includes tests for creating, updating, deleting, and retrieving group data.

- `jakotapahtumaJasenService.test.ts`: Tests services related to jakotapahtumaJasen entities. Ensures proper handling of these entities, including CRUD operations and data validation.

- `jakotapahtumaJasenZod.test.ts`: Validates the data model for jakotapahtumaJasen using Zod schemas. Tests custom field validations and ensures data integrity.

- `jakotapahtumaService.test.ts`: Covers testing for the jakotapahtuma services. Focuses on the correct functionality of creating, updating, and managing distribution events.

- `jakotapahtumaZod.test.ts`: Tests the validation logic for the jakotapahtuma data model using Zod. Ensures the model adheres to the defined structure and data types.

- `jasenService.test.ts`: Contains tests for member management services. Includes scenarios for member creation, updating, deletion, and querying.

- `jasenyysService.test.ts`: Tests services related to membership (jasenyys) management. Ensures correct handling of membership data, including associations and duration.

- `jasenZod.test.ts`: Focuses on validating the jasen data model with Zod. Ensures that member data adheres to specified formats and constraints.

- `kaadonkasittelyService.test.ts`: Tests the services related to the processing of hunting kills (kaadonkasittely). Ensures accurate recording and management of kill processing data.

- `kaatoService.test.ts`: Verifies the functionality of services related to hunting catches (kaato). Tests cover the accurate recording and retrieval of catch data.

- `lupaService.test.ts`: Tests the services for managing hunting permits (lupa). Includes validation of permit data and ensures proper handling of permit-related operations.

- `optionTablesService.test.ts`: Verifies the functionality of services related to various option tables used in the application. Ensures these services correctly handle data retrieval and updates.

- `seurueService.test.ts`: Tests services associated with hunting parties (seurue). Focuses on the creation, management, and retrieval of hunting party data.

- `viewValidationZod.test.ts`: Validates the naming and structure of views in the application using Zod. Aims to prevent SQL injection and data breaches through robust validation.

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

`apiViewService.test.ts` - API View Service Testing
This file tests the API views service, ensuring correct functionality, response formats, and error handling. It's crucial for verifying API endpoints deliver expected data consistently.

`columnValidation.test.ts` - Column Name Validation Tests
Focuses on validating database column names to prevent SQL injection and maintain data integrity, ensuring secure and correctly formatted column names.

`createShotUsageService.test.ts` - Shot Usage Service Functionality Tests
Verifies the functionality of the service managing shot usages, including creating, updating, and validating shot usage data.

`jakoryhmaService.test.ts` - Hunting Group Service Testing
Tests services related to hunting groups (jakoryhma), including creating, updating, deleting, and retrieving group data.

`jakotapahtumaJasenService.test.ts` - JakotapahtumaJasen Service Testing
Focuses on testing services for managing jakotapahtumaJasen entities, ensuring accurate CRUD operations and data validation.

`jakotapahtumaJasenZod.test.ts` - JakotapahtumaJasen Model Validation
Validates the jakotapahtumaJasen data model using Zod schemas, focusing on custom field validations for data integrity.

`jakotapahtumaService.test.ts` - Jakotapahtuma Service Functionality Tests
Covers testing for jakotapahtuma services, ensuring proper creation, updating, and management of distribution events.

`jakotapahtumaZod.test.ts` - Jakotapahtuma Data Model Validation
Tests the validation logic for the jakotapahtuma data model, ensuring adherence to structure and data types.

`jasenService.test.ts` - Member Management Service Testing
Contains tests for member management services, including scenarios for creation, updating, deletion, and querying.

`jasenyysService.test.ts` - Membership Service Testing
Tests services related to membership management, focusing on handling membership data, associations, and duration.

`jasenZod.test.ts` - Jasen Data Model Validation Testing
Ensures the jasen data model complies with specified formats and constraints, focusing on data types and validation logic.

`kaadonkasittelyService.test.ts` - Hunting Kill Processing Service Tests
Verifies services related to hunting kill processing, ensuring accurate data recording and management.

`kaatoService.test.ts` - Hunting Catch Service Testing
Tests services for managing hunting catches, covering recording and retrieval of catch data.

`lupaService.test.ts` - Hunting Permit Service Validation
Focuses on testing services for managing hunting permits, including permit data validation and operational handling.

`optionTablesService.test.ts` - Option Tables Service Functionality Testing
Verifies services for managing various option tables used in the application, ensuring correct data handling and updates.

`seurueService.test.ts` - Hunting Party Service Testing
Tests services associated with hunting parties, covering creation, management, and data retrieval.

`viewValidationZod.test.ts` - View Name Validation Testing
Contains tests for validating view names using Zod, aiming to prevent SQL injection and data breaches through robust validation.


### Best Practices

Keep tests isolated: Each test should run independently without relying on the state created by previous tests.
Test for both expected and unexpected scenarios: Include edge cases and error handling in your tests.
Regularly update tests: As the application evolves, ensure that tests are updated to match the new functionalities and requirements.