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
    try {
        const result = await getAllJakotapahtumat();
        res.json(result);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await createJakotapahtuma(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).send('Invalid data');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await readJakotapahtumaById(id);
        res.json(result);
    } catch (error) {
        res.status(400).send('Invalid ID');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await updateJakotapahtumaById(id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).send('Invalid data or ID');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await deleteJakotapahtumaById(id);
        res.json(result);
    } catch (error) {
        res.status(400).send('Invalid ID');
    }
});

export default router;
