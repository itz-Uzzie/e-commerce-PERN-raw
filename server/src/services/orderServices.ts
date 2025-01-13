import db from "../db";
import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import { io } from "../index";

const userSockets: { [key: string]: string } = {};

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
    const u_id = req.params.u_id;

    await db.query(`insert into address(city, country, area) values($1,$2,$3) returning a_id`, [address.city, address.country, address.area], async (err, result) => {
        if (err) {
            console.log("Error in 1st await of address  :  ", err.message);
            io.to(userSockets[u_id]).emit("order_error", { message: "Failed to add address." });
            return res.status(400).json("Something went wrong while adding address");
        }
        const a_id = result.rows[0].a_id;
        io.to(userSockets[u_id]).emit("order_progress", { step: "Address added successfully" });

        await db.query(`insert into payment(status) values('pending') returning py_id`, async (err, result) => {
            if (err) {
                console.log("Error in depth 1 : ", err.message);
                io.to(userSockets[u_id]).emit("order_error", { message: "Failed to create payment." });
                return res.status(400).json("Something went wrong while creating payment");
            }

            await db.query(`insert into orders(u_id, py_id, a_id) values($1,$2,$3) returning o_id`, [u_id, result.rows[0].py_id, a_id], async (err, result) => {
                if (err) {
                    console.log("Error in depth 2 : ", err.message);
                    io.to(userSockets[u_id]).emit("order_error", { message: "Failed to create order." });
                    return res.status(400).json("Something went wrong while creating order");
                }
                const o_id = result.rows[0].o_id;
                io.to(userSockets[u_id]).emit("order_progress", { step: "Order created successfully" });

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
                        io.to(userSockets[u_id]).emit("order_error", { message: "Failed to add order items." });
                        return res.status(400).json("Something went wrong while placing order");
                    }
                    io.to(userSockets[u_id]).emit("order_progress", { step: "Order items added successfully" });

                    const saleparams: number[] = [];
                    let deliveryValues = result.rows.map((row, i) => {
                        saleparams.push(row.oi_id);
                        return `('pending', $${i + 1})`;
                    }).join(", ");

                    await db.query(`insert into delivery(status, oi_id) values ${deliveryValues} returning oi_id`, saleparams, async (err, result) => {
                        if (err) {
                            console.log("Error in depth 4 :", err.message);
                            io.to(userSockets[u_id]).emit("order_error", { message: "Failed to initiate delivery." });
                            return res.status(400).json("Something went wrong while inserting delivery");
                        }
                        io.to(userSockets[u_id]).emit("order_progress", { step: "Delivery initiated" });

                        const saleInsert = result.rows.map((row, i) => {
                            return `($${i + 1})`
                        }).join(', ');

                        await db.query(`insert into sale(oi_id) values ${saleInsert}`, saleparams, (err) => {
                            if (err) {
                                console.log("Error in depth 5 : ", err.message);
                                io.to(userSockets[u_id]).emit("order_error", { message: "Failed to insert sales." });
                                return res.status(400).json("something went wrong while inserting sales");
                            }
                            io.to(userSockets[u_id]).emit("order_complete", { message: "Order placed successfully" });
                            res.status(201).json("Order placed successfully");
                        });
                    });
                });
            });
        });
    });
};


export const myorders = async (req: CustomRequest, res: Response) => {
    await db.query(`SELECT 
                o.o_id,
                ARRAY_AGG(jsonb_build_object('product_name', p.name, 'quantity', oi.quantity, 'price', p.price)) products,
                SUM(oi.quantity * p.price) total_price,
                py.status payment_status,
                MAX(d.status) delivery_status
            from 
                orders o
            join 
                order_items oi on oi.o_id = o.o_id
            join 
                product p on p.p_id = oi.p_id
            join 
                payment py on py.py_id = o.py_id
             join 
                delivery d on d.oi_id = oi.oi_id
            where 
                o.u_id = $1
            group by 
                o.o_id, py.status
            order by 
                o.o_id desc;`, [req.params.u_id], (err, result) => {
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