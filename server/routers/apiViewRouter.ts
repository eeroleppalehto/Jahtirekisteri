/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Import necessary modules and services
import express from 'express';
import { getViewData } from '../services/apiViewService';
import viewValidationZod from '../zodSchemas/viewValidationZod';

// Initialize an express router
const router = express.Router();

// Define GET route for fetching view data
router.get('/', (async (req, res) => {
    const viewName = req.query.viewName as string;
    const validationResult = viewValidationZod.safeParse(viewName);
    
    if (!validationResult.success) {
        res.status(400).json({ message: 'Invalid view name' });
        return;
    }

    const data = await getViewData(viewName);
    res.status(200).json(data);  // 200 OK
}) as express.RequestHandler);

// Export the router for use in other modules
export default router;
