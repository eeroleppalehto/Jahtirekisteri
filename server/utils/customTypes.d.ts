// customTypes.d.ts

// Importing Express module to extend its types
import 'express';

// Extending the Express module
declare module 'express' {
    // Augmenting the Request interface from Express
    // This is a TypeScript feature that allows modification or extension of existing types
    interface Request {
        // Adding an optional 'id' property to the Request interface
        // This enables TypeScript to understand and accept the 'id' property on Express request objects throughout the application
        // The 'id' property is of type string, but it's optional (indicated by '?'), meaning it might not always be present on the request object
        id?: string;
    }
}