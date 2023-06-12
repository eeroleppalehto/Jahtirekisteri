import express from 'express';
import jasenService from '../services/jasenService';

const jasenRouter = express.Router();

jasenRouter.get('/', (async (_req, res) => {
    const jasenet = await jasenService.getAllJasen();
    res.json(jasenet);
}) as express.RequestHandler);

jasenRouter.post('/', (async (req, res) => {
    const jasen = await jasenService.createJasen(req.body);
    res.status(201).json(jasen);
}) as express.RequestHandler);

jasenRouter.put('/:id', (async (req, res) => {
    const jasen = await jasenService.updateJasen(parseInt(req.params.id), req.body);
    res.json(jasen);
}) as express.RequestHandler);

jasenRouter.delete('/:id', (async (req, res) => {
    const jasen = await jasenService.deleteJasen(parseInt(req.params.id));
    res.status(204).json(jasen);
}) as express.RequestHandler);

export default jasenRouter;