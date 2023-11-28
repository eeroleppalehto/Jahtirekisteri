# Utils Directory Documentation

## Overview

The utils directory in the Jahtirekisteri application contains utility files that provide essential functionalities and helper functions for different parts of the application. These utilities are crucial for the efficient and consistent handling of common tasks throughout the application.

### File Structure

**middleware.ts**

Purpose: Contains middleware functions for error handling within the application. It ensures that errors, especially those arising from validation (Zod) and database operations (Prisma), are handled smoothly and consistently.
Key Components:

ErrorType: A custom type for structuring error messages.
errorHandler: A middleware function that handles various types of errors (e.g., Zod validation errors, Prisma database errors, and generic JavaScript errors) and returns appropriate responses.

**assignRequestId.ts**

Purpose: Adds a unique identifier (ID) to each request, facilitating the tracking and identification of individual requests in log data.
Key Components:

assignRequestId: A middleware function that generates and attaches a unique UUID to each incoming request.

**customTypes.d.ts**

Purpose: Extends the Express Request interface by adding an optional id property. This enables TypeScript to understand and accept the id property on Express request objects throughout the application.

### Usage and Best Practices

Error Handling: Implement the errorHandler middleware in your Express routes to catch and handle errors uniformly. This ensures that your application's error responses are structured and informative, aiding in debugging and providing clear feedback to the end user.

Request Tracking: Use the assignRequestId middleware to add a unique identifier to each request. This facilitates tracking and troubleshooting of requests, especially in log analysis.

### Examples of Usage
Error Handling with errorHandler: The errorHandler middleware is integrated into Express routes to handle errors uniformly. For example, it's used in apiRoutes.ts to manage Zod validation errors and Prisma database errors.

Request Tracking with assignRequestId: Each request is assigned a unique identifier using the assignRequestId middleware, aiding in their tracking and analysis.

### Maintenance and Documentation Update

As the application evolves, it's important to keep this documentation updated. If new utility files are added to the utils directory or if existing utilities undergo significant changes, this document should be revised accordingly to reflect those updates.