import jwt, { Secret } from "jsonwebtoken";
const JWT_SECRET: Secret = "UZAIR1234-x-UZZIE";

export const generatetoken = async (u_id: number, email: string, isadmin: boolean) => {
    return jwt.sign(
        { u_id: u_id, email: email, isadmin: isadmin },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}