// Import required modules and services
import express from "express";
import * as JakoryhmaService from "../../services/jakoryhmaService";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
    WRITE_RIGHTS_SET,
    EDIT_RIGHTS_SET,
    DELETE_RIGHTS_SET,
} from "../../utils/authenticationUtils";

// Initialize the router
const jakoryhmaRouter = express.Router();

// Endpoint to GET all jakoryhmat (groups)
jakoryhmaRouter.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const jakoryhmat = await JakoryhmaService.getAllJakoryhma();
    res.json(jakoryhmat);
}) as express.RequestHandler);

// Endpoint to GET a jakoryhma by its ID
jakoryhmaRouter.get("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    const jakoryhma = await JakoryhmaService.readJakoryhma(id);
    res.json(jakoryhma);
}) as express.RequestHandler);

// Endpoint to POST (create) a new jakoryhma
jakoryhmaRouter.post("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!WRITE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const newJakoryhma = await JakoryhmaService.createJakoryhma(req.body);
    res.json(newJakoryhma);
}) as express.RequestHandler);

// Endpoint to PUT (update) a jakoryhma by its ID
jakoryhmaRouter.put("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!EDIT_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);

    const updatedJakoryhma = await JakoryhmaService.updateJakoryhma(
        id,
        req.body
    );
    res.json(updatedJakoryhma);
}) as express.RequestHandler);

// Endpoint to DELETE a jakoryhma by its ID
jakoryhmaRouter.delete("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!DELETE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    await JakoryhmaService.deleteJakoryhma(id);
    res.status(204).send();
}) as express.RequestHandler);

// Export the router to be used in other parts of the application
export default jakoryhmaRouter;
