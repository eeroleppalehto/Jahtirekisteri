import express from "express";
import { getDecodedToken } from "../../utils/authenticationUtils";
import kayttajaService from "../../services/kayttajaService";

const miscRouter = express.Router();

miscRouter.get("/name", (async (req, res) => {
    const decodedToken = getDecodedToken(req);
    if (!decodedToken)
        return res.status(401).json({ error: "Token missing or invalid" });

    const name = await kayttajaService.getMemberByUsername(
        decodedToken.kayttajatunnus
    );

    res.status(200).json(name);
}) as express.RequestHandler);

export default miscRouter;
