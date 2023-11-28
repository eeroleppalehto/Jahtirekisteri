// utils/assignRequestId.ts

// Importing necessary dependencies: uuid library for UUID generation and Express types
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Exporting 'assignRequestId' middleware which adds a unique ID to each request
export const assignRequestId = (req: Request, _res: Response, next: NextFunction) => {
    // Generating and attaching a unique UUID to the request (req object)
    // This allows for tracking and identifying each request in logs
    req.id = uuidv4();

    // Proceeding to the next middleware
    // In the middleware chain, this ensures that all subsequent middlewares and route handlers receive the request with the included id
    next();
};