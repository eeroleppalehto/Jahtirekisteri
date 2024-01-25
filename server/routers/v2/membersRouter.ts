// Import necessary modules
import express from "express";
import jasenService from "../../services/jasenService";
import {
    getDecodedToken,
    // READ_RIGHTS_SET,
    WRITE_RIGHTS_SET,
    EDIT_RIGHTS_SET,
    DELETE_RIGHTS_SET,
} from "../../utils/authenticationUtils";

// Initialize the router for handling member-related requests
const jasenRouter = express.Router();

// GET endpoint for retrieving all members
jasenRouter.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!EDIT_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all members using the jasenService
    const jasenet = await jasenService.getAllJasen();
    res.json(jasenet);
}) as express.RequestHandler);

// POST endpoint for creating a new member
jasenRouter.post("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!WRITE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Create a new member with the provided data
    const jasen = await jasenService.createJasen(req.body);
    // Send the created member data with a 201 status code
    res.status(201).json(jasen);
}) as express.RequestHandler);

// PUT endpoint for updating a member by ID
jasenRouter.put("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!EDIT_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Update the member with the given ID using the provided data
    const jasen = await jasenService.updateJasen(
        parseInt(req.params.id),
        req.body
    );
    res.json(jasen);
}) as express.RequestHandler);

// DELETE endpoint for removing a member by ID
jasenRouter.delete("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!DELETE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // Delete the member with the given ID
    const jasen = await jasenService.deleteJasen(parseInt(req.params.id));
    // Send a 204 status code indicating successful deletion without content
    res.status(204).json(jasen);
}) as express.RequestHandler);

// Export the router
export default jasenRouter;
