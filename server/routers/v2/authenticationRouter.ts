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

export default loginRouter;
