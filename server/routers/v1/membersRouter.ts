// Import necessary modules
import express from "express";
import jasenService from "../../services/jasenService";

// Initialize the router for handling member-related requests
const jasenRouter = express.Router();

// GET endpoint for retrieving all members
jasenRouter.get("/", (async (_req, res) => {
    // Fetch all members using the jasenService
    const jasenet = await jasenService.getAllJasen();
    res.json(jasenet);
}) as express.RequestHandler);

// POST endpoint for creating a new member
jasenRouter.post("/", (async (req, res) => {
    // Create a new member with the provided data
    const jasen = await jasenService.createJasen(req.body);
    // Send the created member data with a 201 status code
    res.status(201).json(jasen);
}) as express.RequestHandler);

// PUT endpoint for updating a member by ID
jasenRouter.put("/:id", (async (req, res) => {
    // Update the member with the given ID using the provided data
    const jasen = await jasenService.updateJasen(
        parseInt(req.params.id),
        req.body
    );
    res.json(jasen);
}) as express.RequestHandler);

// DELETE endpoint for removing a member by ID
jasenRouter.delete("/:id", (async (req, res) => {
    // Delete the member with the given ID
    const jasen = await jasenService.deleteJasen(parseInt(req.params.id));
    // Send a 204 status code indicating successful deletion without content
    res.status(204).json(jasen);
}) as express.RequestHandler);

// Export the router
export default jasenRouter;
