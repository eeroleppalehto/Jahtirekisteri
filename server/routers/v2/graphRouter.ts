import express from "express";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
} from "../../utils/authenticationUtils";
import prisma from "../../client";

// Initialize an express router
const graphRouter = express.Router();

graphRouter.get("/deer-count", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await prisma.$queryRaw`
    SELECT ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text) AS kokonimi,
        COUNT(kaato.kaato_id)::integer AS count
    FROM jasen
        INNER JOIN kaato ON kaato.jasen_id = jasen.jasen_id
    WHERE kaato.elaimen_nimi = 'Valkohäntäpeura'
    GROUP BY ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text)
    ORDER BY count DESC;`;

    res.status(200).json(data); // 200 OK
}) as express.RequestHandler);

export default graphRouter;
