import express from "express";
import "dotenv/config";
import {
    getDecodedToken,
    READ_RIGHTS_SET,
} from "../../utils/authenticationUtils";
import kayttajaService from "../../services/kayttajaService";

const testRouter = express.Router();

testRouter.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!READ_RIGHTS_SET.has(decodedToken.rooli)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(decodedToken);
    const jasen = await kayttajaService.getKayttajaByUsername(
        decodedToken.kayttajatunnus
    );

    return res.status(200).json({ message: "Valid token", jasen });
}) as express.RequestHandler);

export default testRouter;
