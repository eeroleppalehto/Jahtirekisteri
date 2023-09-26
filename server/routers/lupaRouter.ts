/* eslint-disable @typescript-eslint/no-misused-promises */
// Import necessary modules and services
import express from "express";
import {
    createLupa,
    readLupaById,
    updateLupaById,
    deleteLupaById
} from "../services/lupaService";

// Initialize the Express router
const router = express.Router();

// POST endpoint to create a new 'lupa' record
router.post("/", async (req, res) => {
    // Use the createLupa function from lupaService to add a new 'lupa'
    const newLupa = await createLupa(req.body);
    // Send the newly created 'lupa' as the response
    res.json(newLupa);
});

// GET endpoint to fetch a 'lupa' by its ID
router.get("/:id", async (req, res) => {
    // Convert the ID from string to number
    const id = Number(req.params.id);
    // Validate the ID
    if (!Number.isInteger(id)) {
        return res.status(400).send("Invalid ID");
    }
    // Use readLupaById function to fetch the 'lupa' by its ID
    const lupa = await readLupaById(id);
    // Send the fetched 'lupa' as the response
    res.json(lupa);
});

// PUT endpoint to update a 'lupa' by its ID
router.put("/:id", async (req, res) => {
    // Convert the ID from string to number
    const id = Number(req.params.id);
    // Validate the ID
    if (!Number.isInteger(id)) {
        return res.status(400).send("Invalid ID");
    }
    // Use updateLupaById function to update the 'lupa' by its ID and data
    const updatedLupa = await updateLupaById(id, req.body);
    // Send the updated 'lupa' as the response
    res.json(updatedLupa);
});

// DELETE endpoint to remove a 'lupa' by its ID
router.delete("/:id", async (req, res) => {
    // Convert the ID from string to number
    const id = Number(req.params.id);
    // Validate the ID
    if (!Number.isInteger(id)) {
        return res.status(400).send("Invalid ID");
    }
    // Use deleteLupaById function to remove the 'lupa' by its ID
    const deletedLupa = await deleteLupaById(id);
    // Send the deleted 'lupa' as the response
    res.json(deletedLupa);
});

// Export the router to be used in other parts of the application
export default router;
