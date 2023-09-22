/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import {
    createJakotapahtuma,
    readJakotapahtumaById,
    updateJakotapahtumaById,
    deleteJakotapahtumaById,
    getAllJakotapahtumat
} from '../services/jakotapahtumaService';

const router = express.Router();

router.get('/', async (_req, res) => {
    const result = await getAllJakotapahtumat();
    res.json(result);
});

router.post('/', async (req, res) => {
    const result = await createJakotapahtuma(req.body);
    res.json(result);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        throw new Error('Invalid Id');
    }
    const result = await readJakotapahtumaById(id);
    res.json(result);
});

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        throw new Error('Invalid Id');
    }
    const result = await updateJakotapahtumaById(id, req.body);
    res.json(result);
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        throw new Error('Invalid Id');
    }
    const result = await deleteJakotapahtumaById(id);
    res.json(result);
});

export default router;
