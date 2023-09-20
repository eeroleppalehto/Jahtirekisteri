// Import required libraries and modules
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "express-async-errors";
import jasenRouter from "./routers/jasenRouter";
import kaatoRouter from "./routers/kaatoRouter";
import jakoryhmaRouter from "./routers/jakoryhmaRouter";
import jakotapahtumaRouter from "./routers/jakotapahtumaRouter"; 
import kaadonkasittelyRouter from "./routers/kaadonkasittelyRouter";
import { ZodError } from "zod";

// Initialize the Express application
const app = express();

// Middleware configurations
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads

// Routes
app.get("/ping", (_req, res) => {  // Ping route for checking
    console.log("someone pinged here");
    res.send("pong");
});

// Attach routers to the /api/ path
app.use("/api/members", jasenRouter);
app.use("/api/jakoryhma", jakoryhmaRouter);
app.use("/api/shots", kaatoRouter);
app.use("/api/jakotapahtuma", jakotapahtumaRouter); 
app.use("/api/kaadonkasittely", kaadonkasittelyRouter); // New router added

// Custom error handler
const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorMessage = "Error occurred: ";

    // Conditional error handling
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

// Set the port
const PORT = 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
