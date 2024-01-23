import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import kayttajaService from "../../services/kayttajaService";

const testRouter = express.Router();

const getDecodedToken = (req: express.Request) => {
    const token = req.get("authorization");

    if (!token) throw new Error("Token missing");

    if (!token.startsWith("Bearer ")) throw new Error("Invalid token");

    const filteredToken = token.replace("Bearer ", "");

    return jwt.verify(filteredToken, process.env.JWT_SECRET as string) as {
        kayttaja_id: number;
        kayttajatunnus: string;
    };
};

testRouter.get("/", (async (req, res) => {
    const decodedToken = getDecodedToken(req);

    const jasen = await kayttajaService.getKayttajaByUsername(
        decodedToken.kayttajatunnus
    );

    return res.status(200).json({ message: "Valid token", data: jasen });
}) as express.RequestHandler);

export default testRouter;
