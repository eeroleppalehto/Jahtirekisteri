import express from "express";
import {
    createJakotapahtumaJasen,
    readJakotapahtumaJasenById,
    updateJakotapahtumaJasenById,
    deleteJakotapahtumaJasenById,
    getAllJakotapahtumaJasen,
} from "../services/jakotapahtumaJasenService";

const router = express.Router();

router.post("/", (async (req, res) => {
    const newJakotapahtumaJasen = await createJakotapahtumaJasen(req.body);
    res.json(newJakotapahtumaJasen);
}) as express.RequestHandler);

router.get("/", (async (_req, res) => {
    const jakotapahtumaJasen = await getAllJakotapahtumaJasen();
    res.json(jakotapahtumaJasen);
}) as express.RequestHandler);

router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const jakotapahtumaJasen = await readJakotapahtumaJasenById(id);
    res.json(jakotapahtumaJasen);
}) as express.RequestHandler);

router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const updatedJakotapahtumaJasen = await updateJakotapahtumaJasenById(
        id,
        req.body
    );
    res.json(updatedJakotapahtumaJasen);
}) as express.RequestHandler);

router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const deletedJakotapahtumaJasen = await deleteJakotapahtumaJasenById(id);
    res.json(deletedJakotapahtumaJasen);
}) as express.RequestHandler);

export default router;
