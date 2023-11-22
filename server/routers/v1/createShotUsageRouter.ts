import express from "express";
import { createShotUsage } from "../../services/createShotUsageService";

const createShotUsageRouter = express.Router();

// APi endpoint for creating a shot and usages related to it
createShotUsageRouter.post("/", (async (req, res) => {
    const shotUsage = await createShotUsage(req.body);
    res.json(shotUsage);
}) as express.RequestHandler);

export default createShotUsageRouter;
