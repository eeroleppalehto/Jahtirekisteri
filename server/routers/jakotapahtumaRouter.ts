import express from "express";
import {
    createJakotapahtuma,
    readJakotapahtumaById,
    updateJakotapahtumaById,
    deleteJakotapahtumaById
} from "../services/jakotapahtumaService";

const router = express.Router();

router.post("/", async (req, res) => {
    const newJakotapahtuma = await createJakotapahtuma(req.body);
    res.json(newJakotapahtuma);
});

router.get("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const jakotapahtuma = await readJakotapahtumaById(Number(req.params.id));
    res.json(jakotapahtuma);
});

router.put("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const updatedJakotapahtuma = await updateJakotapahtumaById(Number(req.params.id), req.body);
    res.json(updatedJakotapahtuma);
});

router.delete("/:id", async (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.status(400).send("Invalid ID");
    }
    const deletedJakotapahtuma = await deleteJakotapahtumaById(Number(req.params.id));
    res.json(deletedJakotapahtuma);
});

export default router;
