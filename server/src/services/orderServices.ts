import db from "../db";
import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";

export const placeOrder = async (req: CustomRequest, res: Response) => {
    interface Product {
        p_id: string;
        quantity: number;
    }
    interface Address {
        city: string,
        country: string,
        area: string
    }

    const { products, address }: { products: Product[], address: Address } = req.body;
    await db.query(`insert into address(city, country, area) values($1,$2,$3) returning a_id`, [address.city, address.country, address.area], async (err, result) => {
        if (err) {
            console.log("Error in 1st await of address  :  ", err.message);
            return res.status(400).json("Something went wrong while adding address")
        }
        const a_id = result.rows[0].a_id;
        await db.query(`insert into payment(status) values('pending') returning py_id`, async (err, result) => {
            if (err) {
                console.log("Error in depth 1 : ", err.message);
                return res.status(400).json("Something went wrong while creating payment");
            }

            await db.query(`insert into orders(u_id, py_id, a_id) values($1,$2,$3) returning o_id`, [req.params.u_id, result.rows[0].py_id, a_id], async (err, result) => {
                if (err) {
                    console.log("Error in depth 2 : ", err.message);
                    return res.status(400).json("Something went wrong while creating order")
                }
                const o_id = result.rows[0].o_id;

                let params = [];
                const placeholder = products.map((product, i) => {
                    const idx = i * 2 + 2;
                    params.push(product.p_id, product.quantity);
                    return `($1, $${idx}, $${idx + 1})`
                }).join(", ");
                params.unshift(o_id);

                await db.query(`insert into order_items(o_id, p_id, quantity) values${placeholder} returning oi_id`, params, async (err, result) => {
                    if (err) {
                        console.log("Error in depth 3 :", err.message);
                        return res.status(400).json("Something went wrong while placing order");
                    };

                    const saleparams: number[] = [];
                    let deliveryValues = result.rows.map((row, i) => {
                        saleparams.push(row.oi_id);
                        return `('pending', $${i + 1})`;
                    }).join(", ");

                    await db.query(`insert into delivery(status, oi_id) values ${deliveryValues} returning oi_id`, saleparams, async (err, result) => {
                        if (err) {
                            console.log("Error in depth 4 :", err.message);
                            return res.status(400).json("Something went wrong while inserting delivery");
                        }

                        const saleInsert = result.rows.map((row, i) => {
                            return `($${i + 1})`
                        }).join(', ');

                        await db.query(`insert into sale(oi_id) values ${saleInsert}`, saleparams, (err) => {
                            if (err) {
                                console.log("Error in depth 5 : ", err.message);
                                res.status(400).json("something went wrong while inserting sales")
                            }
                            res.status(201).json("Order placed successfully")
                        });
                    });
                });
            });
        });
    });
}

export const myorders = async (req: CustomRequest, res: Response) => {
    await db.query(`select p.name,oi.quantity,py.status payment,d.status delivery from orders o join order_items oi on oi.o_id = o.o_id join product p on p.p_id = oi.p_id join payment py on py.py_id = o.py_id join delivery d on d.oi_id = oi.oi_id join users u on o.u_id = u.u_id where u.u_id = $1`, [req.params.u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(200).json(result.rows)
    })
}

export const order_complete = async (req: CustomRequest, res: Response) => {
    const { status } = req.body;
    await db.query(`update delivery set status = $1 where oi_id = $2`, [status, req.params.oi_id], (err) => {
        if (err) return res.status(400).json(err.message)
    })
}