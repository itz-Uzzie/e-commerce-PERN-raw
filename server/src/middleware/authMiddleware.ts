import db from "../db";
const JWT_SECRET: Secret = "UZAIR1234-x-UZZIE";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
    user?: any;
    token?: string;
    u_id?: number;
    isadmin?: boolean;
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ message: "Unauthorized. Token not provided." });
        return;
    }
    const jwtToken = token.replace("Bearer ", "").trim();
    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;
        req.token = jwtToken;
        req.u_id = decoded.u_id;
        req.isadmin = decoded.isadmin;
        const userData = await db.query(
            `SELECT u_id, isadmin FROM users WHERE u_id = $1`,
            [decoded.u_id]
        );
        if (userData.rowCount === 0) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        req.user = userData.rows[0];
        return next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
        return;
    }
};

const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.isadmin) {
        res.status(403).json({ message: "Forbidden. Admin access required." });
        return;
    } else {
        next();
    }
};

export { authMiddleware, adminMiddleware };
