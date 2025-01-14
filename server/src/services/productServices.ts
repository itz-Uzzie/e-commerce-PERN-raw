import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import cloudinary from "../utils/cloudinary";
import db from "../db";

export async function newProduct(req: CustomRequest, res: Response) {
    const { name, price, description, stock, ct_id } = req.body;
    const u_id = req.params.u_id;
    if (!name || !price || !stock || !description) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "w-10-ts-Products",
                });
                imageUrls.push(result.secure_url);
            } catch (error) {
                return res.status(500).json({ msg: "Image upload failed" });
            }
        }
    }
    await db.query(
        `insert into product(name,price,description,stock,owner,ct_id) 
        values($1,$2,$3,$4,$5,$6) 
        returning p_id`,
        [name, price, description, stock, u_id, ct_id],
        async (err, result) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            const p_id = result.rows[0].p_id;
            const placeholder = imageUrls.map((_, i) => `($1,$${i + 2})`).join(", ");
            const values = [p_id, ...imageUrls];
            await db.query(
                `insert into Product_Images(p_id,secure_url) values${placeholder}`,
                values,
                (err) => {
                    if (err) {
                        return res.status(400).json(err.message);
                    }
                    res.status(201).json("Product uploaded successfully");
                }
            );
        }
    );
}

export async function deleteProduct(req: CustomRequest, res: Response) {
    const { p_id } = req.params;
    let imageUrls: string[] = [];
    try {
        await db.query(`select secure_url from Product_Images where p_id = $1`, [p_id], (err, result) => {
            imageUrls = result.rows.map(row => row.secure_url);
        });
        const publicIds = imageUrls.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1].split('.')[0];
        });
        for (const id of publicIds) {
            await cloudinary.uploader.destroy(`w-10-ts-Products/${id}`);
        }
        await db.query(`delete from product where p_id = $1`, [p_id]);
        await db.query(`delete from Product_Images where p_id = $1`, [p_id]);
        res.status(200).json({ msg: "Product and images deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ msg: "Failed to delete product", error: err });
    }
}

export async function AllProducts(req: CustomRequest, res: Response) {
    const { page, limit, ct_id } = req.query;
    let params = [];
    let offset: number;
    let limitQuery = "";
    if (page && limit) {
        limitQuery = "LIMIT $1 OFFSET $2"
        offset = (parseInt(page as string) - 1) * parseInt(limit as string);
        params.push(Number(limit));
        params.push(offset);
    }
    let filterQuery = "";

    if (ct_id) {
        if (params[0]) {
            filterQuery = "WHERE p.ct_id = $3";
        } else {
            filterQuery = "WHERE p.ct_id = $1";
        }
        params.push(Number(ct_id));
    }
    const query = `
        select distinct on (p.p_id) p.p_id, p.ct_id, p.name, p.price, pi.secure_url images 
        from product p 
        join Product_Images pi on p.p_id = pi.p_id
        ${filterQuery}
        ${limitQuery}
    `;
    await db.query(query, params, (err, result) => {
        if (err) return res.status(404).json({ error: err.message });
        res.status(200).json(result.rows);
    });
}

export async function singleproduct(req: CustomRequest, res: Response) {
    await db.query(`
        select p.p_id, p.name, p.owner, u.name, p.price, p.description, p.stock, 
        ARRAY_AGG(pi.secure_url) as images
        from users u
        join product p on u.u_id = p.owner
        left join Product_Images pi on p.p_id = pi.p_id
        where p.p_id = $1
        group by p.p_id, u.u_id;`, [req.params.p_id], (err, result) => {
        if (err) return res.status(400).json(err);
        res.status(200).json(result.rows[0]);
    })
}

export async function myProducts(req: CustomRequest, res: Response) {
    await db.query(`select distinct on (p.p_id) p.p_id, pi.secure_url images, p.name, p.price 
        from product p 
        join product_images pi on p.p_id = pi.p_id 
        where p.owner = $1`, [req.params.u_id], (err, result) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json(result.rows);
    })
}