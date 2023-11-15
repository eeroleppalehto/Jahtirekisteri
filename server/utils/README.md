# Utils Directory Documentation

## Overview

The utils directory in the Jahtirekisteri application contains utility files that provide core functionalities and helper functions. These utilities are essential for the application's operation, ensuring efficient and consistent handling of common tasks across the application.

### File Structure

**middleware.ts**

Purpose: Contains middleware functions for error handling in the application. It ensures that errors, particularly those from validation (Zod) and database operations (Prisma), are handled gracefully and consistently.
Key Components:
* ErrorType: A custom type for structuring error messages.
* errorHandler: A middleware function that handles various types of errors (e.g., Zod validation errors, Prisma database errors, and generic JavaScript errors) and returns appropriate responses.

### Usage and Best Practices

Error Handling: Implement errorHandler middleware in your Express routes to catch and handle errors uniformly. This ensures that your application's error responses are structured and informative, aiding in debugging and providing clear feedback to the end user.

### Examples of Usage

Error Handling with errorHandler: The errorHandler middleware is integrated into Express routes to uniformly handle errors. For example, it's used in apiRoutes.ts to catch and manage Zod validation errors and Prisma database errors.

### Maintenance and Documentation Update

As the application evolves, it is important to keep this documentation updated. If new utility files are added to the utils directory or if existing utilities undergo significant changes, this document should be revised accordingly to reflect those updates.