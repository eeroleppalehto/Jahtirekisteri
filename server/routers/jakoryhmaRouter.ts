// Import required modules and services
import express from 'express';
import * as JakoryhmaService from '../services/jakoryhmaService';
// Import Zod schema for data validation
import { JakoryhmaSchema } from '../zodSchemas/jakoryhmaZod';
// Import a utility function for safe error handling
import { safeHandler } from '../utils/safeHandler';

// Initialize the router
const jakoryhmaRouter = express.Router();

// Endpoint to GET all jakoryhmat (groups)
// Using safeHandler for automatic error handling
jakoryhmaRouter.get('/', safeHandler(async (_, res) => {
  // Fetch all groups from the service layer
  const jakoryhmat = await JakoryhmaService.getAllJakoryhma();
  // Send the result as JSON
  res.json(jakoryhmat);
}));

// Endpoint to GET a jakoryhma by its ID
jakoryhmaRouter.get('/:id', safeHandler(async (req, res) => {
  // Parse ID from the URL parameter and convert it to a number
  const id = parseInt(req.params.id);
  // Fetch the group by its ID
  const jakoryhma = await JakoryhmaService.readJakoryhma(id);
  // Send the result as JSON
  res.json(jakoryhma);
}));

// Endpoint to POST (create) a new jakoryhma
jakoryhmaRouter.post('/', safeHandler(async (req, res) => {
  // Validate the incoming data against the Zod schema
  const parsedData = JakoryhmaSchema.safeParse(req.body);
  // If validation fails, return a 400 status
  if (!parsedData.success) {
    res.status(400).send("Invalid data");
    return;
  }
  // Create the new group
  const newJakoryhma = await JakoryhmaService.createJakoryhma(parsedData.data);
  // Send the result as JSON
  res.json(newJakoryhma);
}));

// Endpoint to PUT (update) a jakoryhma by its ID
jakoryhmaRouter.put('/:id', safeHandler(async (req, res) => {
  // Parse ID from the URL parameter and convert it to a number
  const id = parseInt(req.params.id);
  // Validate the incoming data against the Zod schema
  const parsedData = JakoryhmaSchema.safeParse(req.body);
  // If validation fails, return a 400 status
  if (!parsedData.success) {
    res.status(400).send("Invalid data");
    return;
  }
  // Update the group
  const updatedJakoryhma = await JakoryhmaService.updateJakoryhma(id, parsedData.data);
  // Send the result as JSON
  res.json(updatedJakoryhma);
}));

// Endpoint to DELETE a jakoryhma by its ID
jakoryhmaRouter.delete('/:id', safeHandler(async (req, res) => {
  // Parse ID from the URL parameter and convert it to a number
  const id = parseInt(req.params.id);
  // Delete the group
  await JakoryhmaService.deleteJakoryhma(id);
  // Send a 204 status to indicate successful deletion
  res.status(204).send();
}));

// Export the router to be used in other parts of the application
export default jakoryhmaRouter;