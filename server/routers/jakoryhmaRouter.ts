// Import required modules and services
import express from 'express';
import * as JakoryhmaService from '../services/jakoryhmaService';
// Import Zod schema for data validation
import { JakoryhmaSchema } from '../zodSchemas/jakoryhmaZod';

// Initialize the router
const jakoryhmaRouter = express.Router();

// Endpoint to GET all jakoryhmat (groups)
jakoryhmaRouter.get('/', async (_, res) => {
  const jakoryhmat = await JakoryhmaService.getAllJakoryhma();
  res.json(jakoryhmat);
});

// Endpoint to GET a jakoryhma by its ID
jakoryhmaRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const jakoryhma = await JakoryhmaService.readJakoryhma(id);
  res.json(jakoryhma);
});

// Endpoint to POST (create) a new jakoryhma
jakoryhmaRouter.post('/', async (req, res) => {
  const parsedData = JakoryhmaSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).send("Invalid data");
    return;
  }
  const newJakoryhma = await JakoryhmaService.createJakoryhma(parsedData.data);
  res.json(newJakoryhma);
});

// Endpoint to PUT (update) a jakoryhma by its ID
jakoryhmaRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const parsedData = JakoryhmaSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).send("Invalid data");
    return;
  }
  const updatedJakoryhma = await JakoryhmaService.updateJakoryhma(id, parsedData.data);
  res.json(updatedJakoryhma);
});

// Endpoint to DELETE a jakoryhma by its ID
jakoryhmaRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await JakoryhmaService.deleteJakoryhma(id);
  res.status(204).send();
});

// Export the router to be used in other parts of the application
export default jakoryhmaRouter;