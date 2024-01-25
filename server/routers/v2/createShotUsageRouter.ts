import express from "express";
import { createShotUsage } from "../../services/createShotUsageService";
import {
    getDecodedToken,
    WRITE_RIGHTS_SET,
} from "../../utils/authenticationUtils";

const createShotUsageRouter = express.Router();

// APi endpoint for creating a shot and usages related to it
createShotUsageRouter.post("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!WRITE_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const shotUsage = await createShotUsage(req.body);
    res.json(shotUsage);
}) as express.RequestHandler);

export default createShotUsageRouter;
