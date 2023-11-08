// Import required libraries and modules
import express from "express";
import cors from "cors";
import "express-async-errors";
import jasenRouter from "./routers/jasenRouter";
import kaatoRouter from "./routers/kaatoRouter";
import jakoryhmaRouter from "./routers/jakoryhmaRouter";
import jakotapahtumaRouter from "./routers/jakotapahtumaRouter";
import kaadonkasittelyRouter from "./routers/kaadonkasittelyRouter";
import lupaRouter from "./routers/lupaRouter";
import seurueRouter from "./routers/seurueRouter";
import jasenyysRouter from "./routers/jasenyysRouter";
import apiViewRouter from "./routers/apiViewRouter";
import optionTablesRouter from "./routers/optionTablesRouter";
import createShotUsageRouter from "./routers/createShotUsageRouter";
import { errorHandler } from "./utils/middleware"; // Import errorHandler

// Initialize the Express application
const app = express();

// Middleware configurations
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads

// Routes
app.get("/ping", (_req, res) => {
    // Ping route for checking
    console.log("someone pinged here");
    res.send("pong");
});

// Attach routers to the /api/ path
app.use("/api/members", jasenRouter);
app.use("/api/jakoryhma", jakoryhmaRouter);
app.use("/api/shots", kaatoRouter);
app.use("/api/jakotapahtuma", jakotapahtumaRouter);
app.use("/api/kaadonkasittely", kaadonkasittelyRouter);
app.use("/api/lupa", lupaRouter);
app.use("/api/seurue", seurueRouter);
app.use("/api/jasenyys", jasenyysRouter);
app.use("/api/view", apiViewRouter);
app.use("/api/option-tables", optionTablesRouter);
app.use("/api/createShotUsage", createShotUsageRouter);

// Centralized error handling
app.use(errorHandler);

// Set the port
const PORT = 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
