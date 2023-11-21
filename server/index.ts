// Import required libraries and modules
import express from "express";
import cors from "cors";
import "express-async-errors";
import jasenRouter from "./routers/membersRouter";
import kaatoRouter from "./routers/shotsRouter";
import jakoryhmaRouter from "./routers/groupsRouter";
import jakotapahtumaRouter from "./routers/sharesRouter";
import kaadonkasittelyRouter from "./routers/shotUsagesRouter";
import lupaRouter from "./routers/licensesRouter";
import seurueRouter from "./routers/partiesRouter";
import jasenyysRouter from "./routers/membershipsRouter";
import apiViewRouter from "./routers/apiViewRouter";
import optionTablesRouter from "./routers/optionTablesRouter";
import createShotUsageRouter from "./routers/createShotUsageRouter";
import jakotapahtumaJasenRouter from "./routers/memberSharesRouter";
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
app.use("/api/groups", jakoryhmaRouter);
app.use("/api/shots", kaatoRouter);
app.use("/api/shares", jakotapahtumaRouter);
app.use("/api/shot-usages", kaadonkasittelyRouter);
app.use("/api/licenses", lupaRouter);
app.use("/api/parties", seurueRouter);
app.use("/api/memberships", jasenyysRouter);
app.use("/api/view", apiViewRouter);
app.use("/api/option-tables", optionTablesRouter);
app.use("/api/createShotUsage", createShotUsageRouter);
app.use("/api/member-shares", jakotapahtumaJasenRouter);


// Centralized error handling
app.use(errorHandler);

// Set the port
const PORT = 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
