import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import db from "../db";

export const myNotification = async (req: CustomRequest, res: Response) => {
    await db.query(`select * from notification where u_id = $1 order by created_at desc`, [req.params.u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json(result.rows);
    })
}

export const markAsRead = async (req: CustomRequest, res: Response) => {
    await db.query(`update notification set isread = true where n_id = $1`, [req.params.n_id], (err) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json("Notification status updated successfully")
    })
}