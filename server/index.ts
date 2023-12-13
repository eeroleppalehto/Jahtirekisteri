// Import required libraries and modules
import express from "express";
import cors from "cors";
import "express-async-errors";
import "dotenv/config";
import jasenRouter from "./routers/v1/membersRouter";
import kaatoRouter from "./routers/v1/shotsRouter";
import jakoryhmaRouter from "./routers/v1/groupsRouter";
import jakotapahtumaRouter from "./routers/v1/sharesRouter";
import kaadonkasittelyRouter from "./routers/v1/shotUsagesRouter";
import lupaRouter from "./routers/v1/licensesRouter";
import seurueRouter from "./routers/v1/partiesRouter";
import jasenyysRouter from "./routers/v1/membershipsRouter";
import apiViewRouter from "./routers/v1/apiViewRouter";
import optionTablesRouter from "./routers/v1/optionTablesRouter";
import createShotUsageRouter from "./routers/v1/createShotUsageRouter";
import jakotapahtumaJasenRouter from "./routers/v1/memberSharesRouter";
import { errorHandler, logRequest, unknownEndpoint } from "./utils/middleware";

// Initialize the Express application
const app = express();

// Middleware configurations
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads

app.use(logRequest); // Log requests and responses

// Routes
app.get("/ping", (_req, res) => {
    // Ping route for checking
    console.log("someone pinged here");
    res.send("pong");
});

// Attach routers to the /api/v1/ path
app.use("/api/v1/members", jasenRouter);
app.use("/api/v1/groups", jakoryhmaRouter);
app.use("/api/v1/shots", kaatoRouter);
app.use("/api/v1/shares", jakotapahtumaRouter);
app.use("/api/v1/shot-usages", kaadonkasittelyRouter);
app.use("/api/v1/licenses", lupaRouter);
app.use("/api/v1/parties", seurueRouter);
app.use("/api/v1/memberships", jasenyysRouter);
app.use("/api/v1/views", apiViewRouter);
app.use("/api/v1/option-tables", optionTablesRouter);
app.use("/api/v1/shot-with-usages", createShotUsageRouter);
app.use("/api/v1/member-shares", jakotapahtumaJasenRouter);

// Middleware for handling unknown endpoints
app.use(unknownEndpoint);

// Centralized error handling
app.use(errorHandler);

// Set the port
const PORT = process.env.PORT ? process.env.PORT : 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});