import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import db from "../db";

export async function addCategory(req: CustomRequest, res: Response) {
    await db.query(`insert into category(name) values($1)`, [req.body.name], (err) => {
        if (err) return res.status(400).json(err.message);
        return res.status(201).json("Category added successfully")
    })
}

export async function allCategories(req: CustomRequest, res: Response) {
    await db.query(`select * from category`, (err,result) => {
        if (err) return res.status(400).json(err.message);
        return res.status(201).json(result.rows)
    })
}