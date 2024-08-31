import { Request } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Retrieves the decoded token from the request object.
 * @param req - The request object.
 * @returns The decoded token containing user information.
 * @throws Error if the token is missing or invalid.
 */
export const getDecodedToken = (req: Request) => {
    const token = req.get("authorization");

    if (!token) throw new Error("Token missing");

    if (!token.startsWith("Bearer ")) throw new Error("Invalid token");

    const filteredToken = token.replace("Bearer ", "");

    return jwt.verify(filteredToken, process.env.JWT_SECRET as string) as {
        kayttaja_id: number;
        kayttajatunnus: string;
        rooli: string;
        iat: number;
    };
};

/**
 * Below are sets of rights that are required for each operation.
 */
export const READ_RIGHTS_SET = new Set([
    "pääkäyttäjä",
    "muokkaus",
    "lisäys",
    "luku",
]);
export const WRITE_RIGHTS_SET = new Set(["pääkäyttäjä", "muokkaus", "lisäys"]);
export const EDIT_RIGHTS_SET = new Set(["pääkäyttäjä", "muokkaus"]);
export const DELETE_RIGHTS_SET = new Set(["pääkäyttäjä"]);
