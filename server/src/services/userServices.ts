import { Request, Response } from "express";
import db from "../db";
import { generatetoken } from "../middleware/token";
import { CustomRequest } from "../middleware/authMiddleware";

export async function signup(req: CustomRequest, res: Response) {
    const { name, email, password } = req.body;
    const user = await db.query(`select u_id from users where email = $1`, [email]);
    if (user.rowCount == 1) {
        res.status(400).json("Email already exist")
    } else {
        await db.query(
            `insert into users(name,email,password) values($1,$2,$3)`,
            [name, email, password],
            (err) => {
                if (err) return res.status(400).json({ error: err });
                res.status(201).json("User created successfuly");
            }
        );
    }
}

export async function login(req: CustomRequest, res: Response) {
    const { email, password } = req.body;
    await db.query("select * from users where email = $1 ", [email], async (err, result) => {
        if (err) return res.status(404).json(err);
        else {
            if (result.rows[0]?.password == password) {
                const u_id: number = result.rows[0].u_id;
                const isadmin: boolean = result.rows[0].isadmin;
                const token = await generatetoken(u_id, email, isadmin);
                return res.status(200).json({ token: token, user: result.rows[0] })
            } else {
                return res.status(401).json("Invalid Credentials")
            }
        }
    })
}

export async function profile(req: CustomRequest, res: Response) {
    await db.query(
        `select * from users where u_id = $1`, [req.params.id],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            return res.status(200).json(result.rows[0])
        }
    );
}

export async function allusers(req: CustomRequest, res: Response) {
    await db.query(
        `select * from users order by u_id asc`,
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            return res.status(200).json(result.rows)
        }
    );
}

export async function updPassword(req: CustomRequest, res: Response) {
    const { newpassword } = req.body;
    await db.query(
        `update users set password = $1 where u_id = $2`,
        [newpassword, req.params.id],
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(200).json("Password updated successfuly")
        }
    );
}

export async function removeUser(req: CustomRequest, res: Response) {
    await db.query(`delete from users where u_id = $1`, [req.params.id], (err) => {
        if (err) return res.status(400).json(err.message);
        res.status(204).json("User removed successfuly")
    })
};

export async function testing(req: CustomRequest, res: Response) {
    const result = await db.query(`select from users where u_id = $1`, [req.params.id]);
    res.status(200).json(result.rows);
}