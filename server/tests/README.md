# Tests Directory Documentation

## Overview

This directory contains automated tests for the Jahtirekisteri application. The tests are designed to ensure the reliability and correctness of the application's functionality, particularly focusing on its backend services and database interactions.

### File Structure

- `jasenService.test.ts`: Contains tests for member management services including member creation, updating, deletion, and listing.

### Testing Framework and Tools

- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.
- **ts-jest**: A TypeScript preprocessor with source map support for Jest.
- **Prisma Client**: Used for database interactions in the tests.

### Running the Tests

To run the tests, navigate to the `server` directory and use the following command:

cd server
npm test

This command will execute all the tests in the tests directory and provide a report on their outcomes.

jasen.test.ts - Member Management Tests
Overview
jasen.test.ts includes tests for the member management functionality of the application. It ensures that all operations related to members (creating, updating, deleting, and listing) work as expected.

Tests Included
Member Creation: Tests that a new member can be created and the correct member data is returned.
Member Updating: Validates that an existing member's details can be updated and the updated information is correctly reflected.
Member Deletion: Confirms that a member can be deleted and is no longer retrievable from the database.
Listing Members: Checks that the application can list all members and returns the correct member data.
Mocking
The Prisma Client is mocked to avoid interaction with the actual database during testing, ensuring test isolation and no side effects on the development database.
Best Practices
Keep tests isolated: Each test should run independently without relying on the state created by previous tests.
Test for both expected and unexpected scenarios: Include edge cases and error handling in your tests.
Regularly update tests: As the application evolves, ensure that tests are updated to match the new functionalities and requirements.