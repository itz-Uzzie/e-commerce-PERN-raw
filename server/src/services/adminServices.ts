import { Response } from "express";
import db from "../db";
import { CustomRequest } from "../middleware/authMiddleware";

export async function allusers(req: CustomRequest, res: Response) {
    await db.query(
        `select u_id,name,email,password from users order by u_id asc`,
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            return res.status(200).json(result.rows)
        }
    );
}

export const allpayments = async (req: CustomRequest, res: Response) => {
    await db.query(`select o.o_id, py.p_id, p.status from orders o join payment py on o.py_id = py.py_id`, (err, result) => {
        if (err) return res.status(4000).json(err.message);
        return res.status(200).json(result.rows);
    })
}

export const payment_approved = async (req: CustomRequest, res: Response) => {
    await db.query(`update payment set status = 'approved' where py_id = (select py_id from orders where o_id = $1)`, [req.params.o_id], (err) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json("Status updated successfully")
    })
}