// Import required modules and services
import express from "express";
import {
    createJakotapahtuma,
    readJakotapahtumaById,
    updateJakotapahtumaById,
    deleteJakotapahtumaById,
    getAllJakotapahtumat,
} from "../../services/jakotapahtumaService";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
    WRITE_RIGHTS_SET,
    EDIT_RIGHTS_SET,
    DELETE_RIGHTS_SET,
} from "../../utils/authenticationUtils";

// Initialize a new router for handling share-related requests
const router = express.Router();

// POST endpoint to create a new share event
router.post("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!WRITE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Create a new share event with provided data
    const newJakotapahtuma = await createJakotapahtuma(req.body);
    res.json(newJakotapahtuma);
}) as express.RequestHandler);

// GET endpoint to retrieve all share events
router.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all share events
    const jakotapahtumat = await getAllJakotapahtumat();
    res.json(jakotapahtumat);
}) as express.RequestHandler);

// GET endpoint to retrieve a specific share event by ID
router.get("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Fetch a specific share event by ID
    const jakotapahtuma = await readJakotapahtumaById(id);
    res.json(jakotapahtuma);
}) as express.RequestHandler);

// PUT endpoint to update a share event by ID
router.put("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!EDIT_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Update a specific share event by ID with provided data
    const updatedJakotapahtuma = await updateJakotapahtumaById(id, req.body);
    res.json(updatedJakotapahtuma);
}) as express.RequestHandler);

// DELETE endpoint to remove a share event by ID
router.delete("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!DELETE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    // Delete a specific share event by ID
    const deletedJakotapahtuma = await deleteJakotapahtumaById(id);
    res.json(deletedJakotapahtuma);
}) as express.RequestHandler);

// Export the router for use in the main application
export default router;
