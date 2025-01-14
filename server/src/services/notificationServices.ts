import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import db from "../db";

export const myNotification = async (req: CustomRequest, res: Response) => {
    await db.query(`select * from notification where u_id = $1 order by created_at desc`, [req.params.u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json(result.rows);
    })
}