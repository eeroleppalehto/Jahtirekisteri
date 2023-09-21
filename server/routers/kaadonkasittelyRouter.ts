/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
    createKaadonkasittely,
    readKaadonkasittelyById,
    updateKaadonkasittelyById,
    deleteKaadonkasittelyById
} from "../services/kaadonkasittelyService";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newKaadonkasittely = await createKaadonkasittely(req.body);
        res.json(newKaadonkasittely);
    } catch (error) {
        res.status(400).send('Invalid data');
    }
});

router.get("/:id", async (req, res) => {
    try {
        const kaadonkasittely = await readKaadonkasittelyById(Number(req.params.id));
        res.json(kaadonkasittely);
    } catch (error) {
        res.status(400).send('Invalid ID');
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedKaadonkasittely = await updateKaadonkasittelyById(Number(req.params.id), req.body);
        res.json(updatedKaadonkasittely);
    } catch (error) {
        res.status(400).send('Invalid data or ID');
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedKaadonkasittely = await deleteKaadonkasittelyById(Number(req.params.id));
        res.json(deletedKaadonkasittely);
    } catch (error) {
        res.status(400).send('Invalid ID');
    }
});

export default router;
