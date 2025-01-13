import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import db from "../db";

export const mysales = async (req: CustomRequest, res: Response) => {
    const { u_id } = req.params;
    await db.query(`select s.s_id,p.name,oi.quantity,concat(a.city,', ',a.country,', ',a.area), d.status delivery, py.status payment from sale s join order_items oi on oi.oi_id = s.oi_id join orders o on o.o_id = oi.o_id join product p on p.p_id = oi.p_id join payment py on py.py_id = o.py_id join delivery d on d.oi_id = oi.oi_id join users u on u.u_id = p.owner join address a on a.a_id = o.a_id where u.u_id = $1`, [u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json(result.rows);
    })
}