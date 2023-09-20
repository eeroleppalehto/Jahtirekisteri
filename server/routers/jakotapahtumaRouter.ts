/* eslint-disable @typescript-eslint/no-misused-promises */

// Import required libraries and modules
import express from 'express';
import * as jakotapahtumaService from '../services/jakotapahtumaService';
import jakotapahtumaZod from '../zodSchemas/jakotapahtumaZod';
import { z } from 'zod';

// Initialize a new router
const router = express.Router();

// Define data type for jakotapahtuma based on Zod schema
type jakotapahtumaType = z.infer<typeof jakotapahtumaZod>;

// Fetch all jakotapahtuma entries
router.get('/', async (_req, res) => {
    const result = await jakotapahtumaService.getAll();
    res.json(result);
});

// Create a new jakotapahtuma entry
router.post('/', async (req, res) => {
    const data: jakotapahtumaType = jakotapahtumaZod.parse(req.body);
    const result = await jakotapahtumaService.create(data);
    res.json(result);
});

// Fetch a single jakotapahtuma entry by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await jakotapahtumaService.read(id);
    res.json(result);
});

// Update a jakotapahtuma entry by ID
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data: Partial<jakotapahtumaType> = jakotapahtumaZod.parse(req.body);
    const result = await jakotapahtumaService.update(id, data);
    res.json(result);
});

// Delete a jakotapahtuma entry by ID
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await jakotapahtumaService.del(id);
    res.json(result);
});

// Export the router for use in other modules
export default router;
