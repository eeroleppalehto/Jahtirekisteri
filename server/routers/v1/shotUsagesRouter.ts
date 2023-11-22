// Import required modules and services
import express from "express";
import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    getAllKaadonkasittelyt,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById,
} from "../../services/kaadonkasittelyService";

// Initialize a new router for handling shot usage-related requests
const router = express.Router();

// POST endpoint to create a new shot usage entry
router.post("/", (async (req, res) => {
    // Create a new shot usage entry with provided data
    const newKaadonkasittely = await createKaadonkasittely(req.body);
    res.json(newKaadonkasittely);
}) as express.RequestHandler);

// GET endpoint to retrieve all shot usage entries
router.get("/", (async (_req, res) => {
    // Fetch all shot usage entries
    const kaadonkasittelyt = await getAllKaadonkasittelyt();
    res.json(kaadonkasittelyt);
}) as express.RequestHandler);

// GET endpoint to retrieve a specific shot usage entry by ID
router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Fetch a specific shot usage entry by ID
    const kaadonkasittely = await readKaadonkasittelyById(id);
    res.json(kaadonkasittely);
}) as express.RequestHandler);

// PUT endpoint to update a shot usage entry by ID
router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Update a specific shot usage entry by ID with provided data
    const updatedKaadonkasittely = await updateKaadonkasittelyById(
        id,
        req.body
    );
    res.json(updatedKaadonkasittely);
}) as express.RequestHandler);

// DELETE endpoint to remove a shot usage entry by ID
router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Delete a specific shot usage entry by ID
    const deletedKaadonkasittely = await deleteKaadonkasittelyById(id);
    res.json(deletedKaadonkasittely);
}) as express.RequestHandler);

// Export the router for use in the main application
export default router;
