// Import required types from Express library
import { Request, Response, NextFunction } from 'express';

/**
 * safeHandler is a higher-order function that wraps an async route handler
 * to catch any errors that it throws, and then forwards those errors to
 * Express' built-in error handling mechanism.
 *
 * @param handler The async function representing the route handling logic
 * @returns A wrapped function that catches and handles errors
 */
export const safeHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  // Return a new async function
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Execute the original handler
      await handler(req, res, next);
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error occurred:', error);
      
      // Respond with a 500 Internal Server Error status code
      res.status(500).send('Internal Server Error');
    }
  };
};
