// utils/middleware.ts

// Importing necessary types from express, zod, and prisma
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// Defining a custom type for structured error messages
export type ErrorType = {
    success: boolean;
    errorType: string;
    errorMessage: string;
    errorDetails: string[] | unknown[];
};

// Custom error handler function
export const errorHandler = (
    error: unknown,                // Captured error object
    _req: Request,                 // Request object (not used, hence prefixed with '_')
    res: Response,                 // Response object for sending back data
    next: NextFunction             // Callback to the next middleware
) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        // Construct a return object that conforms to the custom ErrorType
        const returnObject: ErrorType = {
            success: false,
            errorType: "ZodError",
            errorMessage: "Invalid input",
            errorDetails: []
        };

        // Populate error details based on Zod issues
        error.issues.forEach((issue) => {
            returnObject.errorDetails.push(`${issue.path}: ${issue.message}`);
        });

        // Send a 400 Bad Request with the error object
        return res.status(400).json(returnObject);
    } 
    // Handle Prisma known request errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Construct a return object that conforms to the custom ErrorType
        const returnObject: ErrorType = {
            success: false,
            errorType: "PrismaClientKnownRequestError",
            errorMessage: "Error in database query",
            errorDetails: [error.code, error.meta]
        };

        // Send a 400 Bad Request with the error object
        return res.status(400).send(returnObject);
    }
    // Handle generic JavaScript errors
    else if (error instanceof Error) {
        // Construct a return object that conforms to the custom ErrorType
        const returnObject: ErrorType = {
            success: false,
            errorType: "Error",
            errorMessage: error.message,
            errorDetails: []
        };

        // Send a 400 Bad Request with the error object
        return res.status(400).send(returnObject);
    }

    // Pass to the next middleware if error is not handled
    next(error);
};