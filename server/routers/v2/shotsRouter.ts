import express from "express";
import kaatoService from "../../services/kaatoService";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
    WRITE_RIGHTS_SET,
    EDIT_RIGHTS_SET,
    DELETE_RIGHTS_SET,
} from "../../utils/authenticationUtils";

const kaatoRouter = express.Router();

// Define GET, POST, PUT, DELETE routes for client to use

// GET for getting all kaadot
kaatoRouter.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const kaadot = await kaatoService.getAllKaato();
    res.json(kaadot);
}) as express.RequestHandler);

// POST for creating a new kaato
kaatoRouter.post("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!WRITE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const kaato = await kaatoService.createKaato(req.body);
    res.status(201).json(kaato);
}) as express.RequestHandler);

// PUT for updating an existing kaato
kaatoRouter.put("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!EDIT_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const kaato = await kaatoService.updateKaato(
        parseInt(req.params.id),
        req.body
    );
    res.json(kaato);
}) as express.RequestHandler);

// DELETE for deleting an existing kaato
kaatoRouter.delete("/:id", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!DELETE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const kaato = await kaatoService.deleteKaato(parseInt(req.params.id));
    res.status(204).json(kaato);
}) as express.RequestHandler);

export default kaatoRouter;
