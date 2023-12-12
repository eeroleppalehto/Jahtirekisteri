// Importing necessary types from express, zod, and prisma
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { writeLog } from "../logModule";

// Defining a custom type for structured error messages
export type ErrorType = {
    success: boolean;
    errorType: string;
    errorMessage: string;
    errorDetails: string[] | unknown[];
};

// Custom middleware for logging requests and responses
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    // Store the original 'send' method of the response object
    const originalSend = res.send;

    const path = req.path;

    // Override the 'send' method with a custom implementation
    res.send = function (data: string | Buffer) {
        // Here you can specify the type of data if necessary
        // Log the request and response details in a non-blocking way
        writeLog(
            `Datetime: ${new Date().toISOString()}, Route: ${path}, Method: ${
                req.method
            }, Status: ${res.statusCode}`
        ).catch((error) => console.error("Log error:", error));

        // Use the spread operator to pass all arguments to the original send function
        return originalSend.apply(res, [data]);
    };
    // Proceed to the next middleware
    next();
};

// Middleware for handling requests to unknown endpoints
export const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        errorType: "NotFound",
        errorMessage: "Unknown Endpoint",
        errorDetails: ["The requested endpoint does not exist in the API"]
    });
};

// Custom error handler function
export const errorHandler = (
    error: unknown, // Captured error object
    _req: Request, // Request object (not used, hence prefixed with '_')
    res: Response, // Response object for sending back data
    next: NextFunction // Callback to the next middleware
) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        // Construct a return object that conforms to the custom ErrorType
        const returnObject: ErrorType = {
            success: false,
            errorType: "ZodError",
            errorMessage: "Invalid input",
            errorDetails: [],
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
            errorDetails: [error.code, error.meta],
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
            errorDetails: [],
        };

        // Send a 400 Bad Request with the error object
        return res.status(400).send(returnObject);
    }

    // Pass to the next middleware if error is not handled
    next(error);
};