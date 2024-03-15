/**
 * 2024-01-18 Eero Leppälehto userRouter
 * userRouter.ts
 *
 * Router module for handling CRUD operations for 'kayttaja' table and
 * authentication.
 *  */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { loginInput } from "../../zodSchemas/kayttajaValidation";
import kayttajaService from "../../services/kayttajaService";
import jasenService from "../../services/jasenService";
import kaatoService from "../../services/kaatoService";
import { getDecodedToken } from "../../utils/authenticationUtils";

const loginRouter = express.Router();

// POST endpoint for authenticating a user and returning a JWT token
loginRouter.post("/login", (async (req, res) => {
    const data = loginInput.parse(req.body);
    const { kayttajatunnus, salasana } = data;

    const kayttaja = await kayttajaService.getKayttajaByUsername(
        kayttajatunnus
    );

    if (!kayttaja)
        return res
            .status(401)
            .json({ error: "Väärä käyttäjätunnus tai salasana" });

    const authenticationResult = await bcrypt.compare(
        salasana,
        kayttaja.salasana_hash
    );

    if (!authenticationResult)
        return res
            .status(401)
            .json({ error: "Väärä käyttäjätunnus tai salasana" });

    const userForToken = {
        kayttaja_id: kayttaja.kayttaja_id,
        kayttajatunnus: kayttaja.kayttajatunnus,
        rooli: kayttaja.roolin_nimi,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET as string);

    res.status(200).send({
        token,
        kayttajatunnus: kayttaja.kayttajatunnus,
        rooli: kayttaja.roolin_nimi,
    });
}) as express.RequestHandler);

loginRouter.get("/user", ((req, res) => {
    const decodedToken = getDecodedToken(req);
    if (!decodedToken)
        return res.status(401).json({ error: "Token missing or invalid" });

    res.status(200).json({
        kayttajatunnus: decodedToken.kayttajatunnus,
        rooli: decodedToken.rooli,
    });
}) as express.RequestHandler);

loginRouter.get("/userinfo", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    if (!decodedToken)
        return res.status(401).json({ error: "Token missing or invalid" });

    const kayttaja = await kayttajaService.getKayttajaByUsername(
        decodedToken.kayttajatunnus
    );

    if (!kayttaja) return res.status(401).json({ error: "Käyttäjää ei löydy" });

    const jasen = await jasenService.getJasenById(kayttaja.jasen_id);

    if (!jasen) return res.status(401).json({ error: "Jäsentä ei löydy" });

    const kaadot = await kaatoService.getKaatoByJasenId(jasen.jasen_id);

    res.status(200).json({
        kayttaja: {
            kayttajatunnus: decodedToken.kayttajatunnus,
            rooli: decodedToken.rooli,
            jasen_id: jasen.jasen_id,
            nimi: `${jasen.etunimi} ${jasen.sukunimi}`,
            osoite: jasen.jakeluosoite,
            postinumero: jasen.postinumero,
            postitoimipaikka: jasen.postitoimipaikka,
            puhelin: jasen.puhelinnumero,
        },
        kaadot: kaadot,
    });
}) as express.RequestHandler);

export default loginRouter;
