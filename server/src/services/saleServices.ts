import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import db from "../db";

export const mysales = async (req: CustomRequest, res: Response) => {
    const { u_id } = req.params;
    await db.query(`select 
        oi.oi_id, s.s_id,p.name,oi.quantity,concat(a.city,', ',a.country,', ',a.area) address, d.status delivery, py.status payment 
        from sale s 
        join order_items oi on oi.oi_id = s.oi_id 
        join orders o on o.o_id = oi.o_id 
        join product p on p.p_id = oi.p_id 
        join payment py on py.py_id = o.py_id 
        join delivery d on d.oi_id = oi.oi_id 
        join users u on u.u_id = p.owner 
        join address a on a.a_id = o.a_id 
        where u.u_id = $1 order by s.s_id desc`, [u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json(result.rows);
    })
}

export const update_delivery_status = async (req: CustomRequest, res: Response) => {
    const oi_id = req.params.oi_id;
    const { delivery } = req.body;
    await db.query(`update delivery set status = $1 where oi_id = $2`, [delivery, oi_id], (err) => {
        if (err) return res.status(500).json("Something went wrong while updating status in backend");
        return res.status(200).json("Delivery Status updated successfully")
    })
}