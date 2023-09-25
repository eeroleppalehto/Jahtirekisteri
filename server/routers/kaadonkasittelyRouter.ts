import express from "express";
import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    getAllKaadonkasittelyt,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById,
} from "../services/kaadonkasittelyService";

const router = express.Router();

router.post("/", (async (req, res) => {
    const newKaadonkasittely = await createKaadonkasittely(req.body);
    res.json(newKaadonkasittely);
}) as express.RequestHandler);

router.get("/", (async (_req, res) => {
    const kaadonkasittelyt = await getAllKaadonkasittelyt();
    res.json(kaadonkasittelyt);
}) as express.RequestHandler);

router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const kaadonkasittely = await readKaadonkasittelyById(id);
    res.json(kaadonkasittely);
}) as express.RequestHandler);

router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const updatedKaadonkasittely = await updateKaadonkasittelyById(
        id,
        req.body
    );
    res.json(updatedKaadonkasittely);
}) as express.RequestHandler);

router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const deletedKaadonkasittely = await deleteKaadonkasittelyById(id);
    res.json(deletedKaadonkasittely);
}) as express.RequestHandler);

export default router;
