import express from "express";
import {
    createJakotapahtuma,
    readJakotapahtumaById,
    updateJakotapahtumaById,
    deleteJakotapahtumaById,
    getAllJakotapahtumat,
} from "../services/jakotapahtumaService";

const router = express.Router();

router.post("/", (async (req, res) => {
    const newJakotapahtuma = await createJakotapahtuma(req.body);
    res.json(newJakotapahtuma);
}) as express.RequestHandler);

router.get("/", (async (_req, res) => {
    const jakotapahtumat = await getAllJakotapahtumat();
    res.json(jakotapahtumat);
}) as express.RequestHandler);

router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const jakotapahtuma = await readJakotapahtumaById(id);
    res.json(jakotapahtuma);
}) as express.RequestHandler);

router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const updatedJakotapahtuma = await updateJakotapahtumaById(id, req.body);
    res.json(updatedJakotapahtuma);
}) as express.RequestHandler);

router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const deletedJakotapahtuma = await deleteJakotapahtumaById(id);
    res.json(deletedJakotapahtuma);
}) as express.RequestHandler);

export default router;
