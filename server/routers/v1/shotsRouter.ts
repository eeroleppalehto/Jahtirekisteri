import express from "express";
import kaatoService from "../../services/kaatoService";

const kaatoRouter = express.Router();

// Define GET, POST, PUT, DELETE routes for client to use

// GET for getting all kaadot
kaatoRouter.get("/", (async (_req, res) => {
    const kaadot = await kaatoService.getAllKaato();
    res.json(kaadot);
}) as express.RequestHandler);

// POST for creating a new kaato
kaatoRouter.post("/", (async (req, res) => {
    const kaato = await kaatoService.createKaato(req.body);
    res.status(201).json(kaato);
}) as express.RequestHandler);

// PUT for updating an existing kaato
kaatoRouter.put("/:id", (async (req, res) => {
    const kaato = await kaatoService.updateKaato(
        parseInt(req.params.id),
        req.body
    );
    res.json(kaato);
}) as express.RequestHandler);

// DELETE for deleting an existing kaato
kaatoRouter.delete("/:id", (async (req, res) => {
    const kaato = await kaatoService.deleteKaato(parseInt(req.params.id));
    res.status(204).json(kaato);
}) as express.RequestHandler);

export default kaatoRouter;
