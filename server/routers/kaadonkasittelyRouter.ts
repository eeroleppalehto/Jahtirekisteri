import express from "express";
import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById
} from "../services/kaadonkasittelyService";

const router = express.Router();

router.post("/", async (req, res) => {
    const newKaadonkasittely = await createKaadonkasittely(req.body);
    res.json(newKaadonkasittely);
});

router.get("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const kaadonkasittely = await readKaadonkasittelyById(Number(req.params.id));
    res.json(kaadonkasittely);
});

router.put("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const updatedKaadonkasittely = await updateKaadonkasittelyById(Number(req.params.id), req.body);
    res.json(updatedKaadonkasittely);
});

router.delete("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const deletedKaadonkasittely = await deleteKaadonkasittelyById(Number(req.params.id));
    res.json(deletedKaadonkasittely);
});

export default router;
