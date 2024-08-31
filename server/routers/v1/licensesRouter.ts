/* eslint-disable @typescript-eslint/no-misused-promises */
// Import necessary modules and services
import express from "express";
import {
    createLupa,
    readLupaById,
    updateLupaById,
    deleteLupaById,
    readAllLupas,
} from "../../services/lupaService";

// Initialize the Express router
const router = express.Router();

// POST endpoint to create a new 'lupa' record
router.post("/", async (req, res) => {
    const newLupa = await createLupa(req.body);
    res.json(newLupa);
});

// GET endpoint to fetch all 'lupa' records
router.get("/", async (_req, res) => {
    const allLupas = await readAllLupas();
    res.json(allLupas);
});

// GET endpoint to fetch a 'lupa' by its ID
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        throw new Error("Invalid ID");
    }
    const lupa = await readLupaById(id);
    res.json(lupa);
});

// PUT endpoint to update a 'lupa' by its ID
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        throw new Error("Invalid ID");
    }
    const updatedLupa = await updateLupaById(id, req.body);
    res.json(updatedLupa);
});

// DELETE endpoint to remove a 'lupa' by its ID
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        throw new Error("Invalid ID");
    }
    const deletedLupa = await deleteLupaById(id);
    res.json(deletedLupa);
});

// Export the router to be used in other parts of the application
export default router;
