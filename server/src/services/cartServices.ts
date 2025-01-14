import db from "../db";
import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";

export async function addtocart(req: CustomRequest, res: Response) {
    if (!(req.params.p_id && req.params.u_id)) {
        return res.status(404).json("Either product-id or user-id not provided")
    }
    await db.query(`select * from cart where owner = $1`, [req.params.u_id], async (err, result) => {
        if (!result.rows[0]) {
            await db.query(
                `insert into cart(owner) values($1) returning c_id`, [req.params.u_id],
                async (err, result) => {
                    if (err) return res.status(400).json({ error: err.message });
                    await db.query(`insert into cart_product(p_id, c_id, quantity) values($1, $2, $3)`, [req.params.p_id, result.rows[0].c_id, 1], (err) => {
                        if (err) return res.status(400).json(err.message);
                        return res.status(201).json("Order added to cart successfully")
                    })
                }
            );
        }
        else {
            const c_id = result.rows[0].c_id;
            await db.query(`select * from cart_product where p_id = $1 and c_id = $2`, [req.params.p_id, result.rows[0].c_id
            ], async (err, result) => {
                if (result.rows[0]) {
                    return res.status(200).json("Already in a cart")
                }
                await db.query(`insert into cart_product(p_id, c_id, quantity) values($1, $2, $3)`, [req.params.p_id, c_id, 1], (err) => {
                    if (err) return res.status(400).json(err.message);
                    return res.status(201).json("Product added to cart successfully")
                })
            })
        }
    })
}

export async function mycart(req: CustomRequest, res: Response) {
    await db.query(
        `select distinct on (p.p_id) p.p_id, p.owner, p.name, cp.quantity, p.price, pi.secure_url image 
        from cart c 
        join cart_product cp on c.c_id = cp.c_id 
        join product p on cp.p_id = p.p_id 
        join product_images pi on p.p_id = pi.p_id 
        where c.owner = $1 
        order by p.p_id asc`, [req.params.u_id],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            return res.status(200).json(result.rows)
        }
    );
}

export const removeFromCart = async (req: CustomRequest, res: Response) => {
    await db.query(`remove from cart where c_id = $1 and p_id = $2`, [req.params.c_id, req.params.p_id], (err) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json("Product removed successfully")
    })
}