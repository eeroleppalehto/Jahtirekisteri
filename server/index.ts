import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "express-async-errors";
import jasenRouter from "./routers/jasenRouter";
import kaatoRouter from "./routers/kaatoRouter";
import jakoryhmaRouter from "./routers/jakoryhmaRouter";
import { ZodError } from "zod";

// Initialize the Express application
const app = express();

// Middleware configurations
// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to connect
app.use(cors());
// Enable the parsing of incoming JSON payloads in request bodies
app.use(express.json());

// Routes
app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
});

// Mount the jasenRouter, kaatoRouter to the /api/ path
app.use("/api/members", jasenRouter);
app.use("/api/jakoryhma", jakoryhmaRouter);
app.use("/api/shots", kaatoRouter);

// Custom error handler
const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorMessage = "Error occurred: ";

    if (error instanceof Error) {
        errorMessage += error.message;
        return res.status(400).send({ error: errorMessage });
    } else if (error instanceof ZodError) {
        errorMessage += error.flatten();
        return res.status(400).json({ error: errorMessage });
    }

    next(error);
};

// Centralized error handling
app.use(errorHandler);

// Set the port to listen on
const PORT = 3000;

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
