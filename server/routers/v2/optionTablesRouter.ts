/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Import necessary modules and services
import express from "express";
import {
    getAllAikuinenvasa,
    getAllElain,
    getAllKasittely,
    getAllRuhonosa,
    getAllSukupuoli,
    getAllSeurueTyyppi,
} from "../../services/optionTablesService";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
} from "../../utils/authenticationUtils";

// Initialize an express router
const router = express.Router();

// Define GET route for fetching aikuinenvasa data
// Fetches all records from the 'aikuinenvasa' table
router.get("/ages", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllAikuinenvasa();
    res.status(200).json(data);
}) as express.RequestHandler); // Typecasting as RequestHandler to handle async function

// Define GET route for fetching elain data
// Fetches all records from the 'elain' table
router.get("/animals", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllElain();
    res.status(200).json(data);
}) as express.RequestHandler);

// Define GET route for fetching kasittely data
// Fetches all records from the 'kasittely' table
router.get("/usages", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllKasittely();
    res.status(200).json(data);
}) as express.RequestHandler);

// Define GET route for fetching lupa data
// Fetches all records from the 'lupa' table
router.get("/portions", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllRuhonosa();
    res.status(200).json(data);
}) as express.RequestHandler);

// Define GET route for fetching sukupuoli data
// Fetches all records from the 'sukupuoli' table
router.get("/genders", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllSukupuoli();
    res.status(200).json(data);
}) as express.RequestHandler);

router.get("/party-types", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAllSeurueTyyppi();
    res.status(200).json(data);
}) as express.RequestHandler);

// Export the router for use in other modules
export default router;
