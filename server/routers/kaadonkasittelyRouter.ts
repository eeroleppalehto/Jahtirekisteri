// Disable specific ESLint rules to avoid issues related to Promise handling and variable assignment
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Import the necessary modules and functions from other files
import express from "express";
import {
    createKaadonkasittely,
    readKaadonkasittely,
    updateKaadonkasittely,
    deleteKaadonkasittely,
} from "../services/kaadonkasittelyService";

// Initialize a new express router
const router = express.Router();

// POST endpoint for creating a new Kaadonkasittely entry
router.post("/", async (req, res) => {
    // Call the create function from the service layer and await its result
    const newKaadonkasittely = await createKaadonkasittely(req.body);
    // Send the newly created Kaadonkasittely entry as JSON response
    res.json(newKaadonkasittely);
});

// GET endpoint to retrieve a Kaadonkasittely entry by its ID
router.get("/:id", async (req, res) => {
    // Call the read function from the service layer and await its result
    const kaadonkasittely = await readKaadonkasittely(Number(req.params.id));
    // Send the retrieved Kaadonkasittely entry as JSON response
    res.json(kaadonkasittely);
});

// PUT endpoint to update an existing Kaadonkasittely entry by its ID
router.put("/:id", async (req, res) => {
    // Call the update function from the service layer and await its result
    const updatedKaadonkasittely = await updateKaadonkasittely(Number(req.params.id), req.body);
    // Send the updated Kaadonkasittely entry as JSON response
    res.json(updatedKaadonkasittely);
});

// DELETE endpoint to remove a Kaadonkasittely entry by its ID
router.delete("/:id", async (req, res) => {
    // Call the delete function from the service layer and await its result
    const deletedKaadonkasittely = await deleteKaadonkasittely(Number(req.params.id));
    // Send the ID of the deleted Kaadonkasittely entry as JSON response
    res.json(deletedKaadonkasittely);
});

// Export the router to make it available for importing in other parts of the application
export default router;
