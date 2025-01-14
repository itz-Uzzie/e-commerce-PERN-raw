import db from "../db";
import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";

export async function allusers(req: CustomRequest, res: Response) {
    await db.query(
        `select u_id, name, email, password from users order by u_id asc`,
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            return res.status(200).json(result.rows)
        }
    );
}

export const payment_approved = async (req: CustomRequest, res: Response) => {
    await db.query(`update payment set status = 'approved' where py_id = (select py_id from orders where o_id = $1)`, [req.params.o_id], (err) => {
        if (err) return res.status(500).json(err.message);
        return res.status(200).json("Payment Status updated successfully")
    })
}

export const allorders = async (req: CustomRequest, res: Response) => {
    await db.query(`select 
                o.o_id,
                ARRAY_AGG(jsonb_build_object('product_name', p.name, 'quantity', oi.quantity, 'price', p.price)) products,
                SUM(oi.quantity * p.price) total_price,
                py.status payment_status,
                MAX(d.status) delivery_status
                from orders o
                join order_items oi on oi.o_id = o.o_id
                join product p on p.p_id = oi.p_id
                join payment py on py.py_id = o.py_id
                 join delivery d on d.oi_id = oi.oi_id
                group by o.o_id, py.status
                order by o.o_id desc;`, (err, result) => {
        if (err) return res.status(500).json(err.message);
        res.status(200).json(result.rows)
    })
}
