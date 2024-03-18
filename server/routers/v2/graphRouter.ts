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

graphRouter.get("/group-shares", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const groupShareData = await prisma.$queryRaw`
        SELECT jakoryhma.ryhma_id,
            jakoryhma.ryhman_nimi,
            jakoryhma.seurue_id,
            ryhmien_osuudet.jakokerroin AS osuus,
            sum(jakotapahtuma.maara) AS maara
        FROM jakoryhma
            LEFT JOIN jakotapahtuma ON jakoryhma.ryhma_id = jakotapahtuma.ryhma_id
            LEFT JOIN ryhmien_osuudet ON jakoryhma.ryhma_id = ryhmien_osuudet.ryhma_id
            JOIN seurue ON jakoryhma.seurue_id = seurue.seurue_id
        WHERE seurue.seurue_tyyppi_id = 1
        GROUP BY jakoryhma.ryhma_id, jakoryhma.ryhman_nimi, jakoryhma.seurue_id, ryhmien_osuudet.jakokerroin
        ORDER BY ryhman_nimi;`;

    if (!groupShareData) {
        return res.status(404).json({ error: "Not found" });
    }

    // const groupMeatSum = await prisma.$queryRaw`

    res.status(200).json(groupShareData); // 200 OK
}) as express.RequestHandler);

export default graphRouter;
