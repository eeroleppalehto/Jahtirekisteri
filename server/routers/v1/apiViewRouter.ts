/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Import necessary modules and services
import express from "express";
import { getViewData } from "../../services/apiViewService";
// import viewValidationZod from '../zodSchemas/viewValidationZod';

// Initialize an express router
const router = express.Router();

// Define GET route for fetching view data
router.get("/", (async (req, res) => {
    const viewName = req.query.viewName;

    const { column, value } = req.query as {
        column: string | undefined;
        value: string | undefined;
    };

    if (typeof viewName !== "string") {
        throw new Error("Invalid view name");
    }

    const data = await getViewData(viewName, column, value);
    res.status(200).json(data); // 200 OK
}) as express.RequestHandler);

// Export the router for use in other modules
export default router;
