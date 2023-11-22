// Disable ESLint rule for promises since they are handled
/* eslint-disable @typescript-eslint/no-misused-promises */

// Import necessary modules and services
import express from "express";
import {
    createSeurue,
    readSeurueById,
    updateSeurueById,
    deleteSeurueById,
    getAllSeurueet,
} from "../../services/seurueService";

// Initialize an express router
const router = express.Router();

// Define POST route for creating a new Seurue
router.post("/", (async (req, res) => {
    const newSeurue = await createSeurue(req.body);
    res.status(201).json(newSeurue); // 201 Created
}) as express.RequestHandler);

// Define GET route for reading all Seurue records
router.get("/", (async (_req, res) => {
    const seurueet = await getAllSeurueet();
    res.status(200).json(seurueet); // 200 OK
}) as express.RequestHandler);

// Define GET route for reading a Seurue by ID
router.get("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const seurue = await readSeurueById(id);
    res.status(200).json(seurue); // 200 OK
}) as express.RequestHandler);

// Define PUT route for updating a Seurue by ID
router.put("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const updatedSeurue = await updateSeurueById(id, req.body);
    res.status(200).json(updatedSeurue); // 200 OK
}) as express.RequestHandler);

// Define DELETE route for deleting a Seurue by ID
router.delete("/:id", (async (req, res) => {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) throw new Error("Invalid ID");

    const deletedSeurue = await deleteSeurueById(id);
    res.status(204).json(deletedSeurue); // 204 No Content
}) as express.RequestHandler);

// Export the router for use in other modules
export default router;
