/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Import required modules and services
import express from "express";
import {
    createJakotapahtumaJasen,
    readJakotapahtumaJasenById,
    updateJakotapahtumaJasenById,
    deleteJakotapahtumaJasenById,
    getAllJakotapahtumaJasen,
} from "../../services/jakotapahtumaJasenService";

// Create a new router for handling member shares related requests
const router = express.Router();

// POST endpoint for creating a new member share
router.post("/", (async (req, res) => {
    const newJakotapahtumaJasen = await createJakotapahtumaJasen(req.body);
    res.json(newJakotapahtumaJasen);
}) as express.RequestHandler);

// GET endpoint for retrieving all member shares
router.get("/", (async (_req, res) => {
    const jakotapahtumaJasen = await getAllJakotapahtumaJasen();
    res.json(jakotapahtumaJasen);
}) as express.RequestHandler);

// GET endpoint for retrieving a single member share by ID
router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    // Validate the ID to ensure it's an integer
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const jakotapahtumaJasen = await readJakotapahtumaJasenById(id);
    res.json(jakotapahtumaJasen);
}) as express.RequestHandler);

// PUT endpoint for updating a member share by ID
router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const updatedJakotapahtumaJasen = await updateJakotapahtumaJasenById(
        id,
        req.body
    );
    res.json(updatedJakotapahtumaJasen);
}) as express.RequestHandler);

// DELETE endpoint for deleting a member share by ID
router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const deletedJakotapahtumaJasen = await deleteJakotapahtumaJasenById(id);
    res.json(deletedJakotapahtumaJasen);
}) as express.RequestHandler);

// Export the router
export default router;
