import { Request, Response } from "express";
import pool from "../config/postgres";

export async function getProducts(req: Request, res: Response) {
  try {
    const {
      search = "",
      brand,
      min_price,
      max_price,
      rating,
      sort = "id",
      page = "1",
      limit = "12",
    } = req.query;

    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR brand ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (brand) {
      conditions.push(`brand = $${idx}`);
      values.push(String(brand));
      idx++;
    }
    if (min_price) {
      conditions.push(`price >= $${idx}`);
      values.push(Number(min_price));
      idx++;
    }
    if (max_price) {
      conditions.push(`price <= $${idx}`);
      values.push(Number(max_price));
      idx++;
    }
    if (rating) {
      conditions.push(`rating >= $${idx}`);
      values.push(Number(rating));
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortMap: Record<string, string> = {
      price_asc: "price ASC",
      price_desc: "price DESC",
      rating: "rating DESC",
      newest: "created_at DESC",
      id: "id ASC",
    };
    const orderBy = sortMap[String(sort)] || "id ASC";

    const offset = (Number(page) - 1) * Number(limit);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${where}`,
      values
    );
    const total = Number(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM products ${where} ORDER BY ${orderBy} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, Number(limit), offset]
    );

    res.json({
      data: result.rows,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Mahsulot topilmadi" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, image, rating, stock, brand, category, description, badge } = req.body;
    if (!name || !price) {
      res.status(400).json({ message: "Nom va narx majburiy" });
      return;
    }
    const result = await pool.query(
      `INSERT INTO products (name, price, image, rating, stock, brand, category, description, badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, price, image, rating || 0, stock || 0, brand, category, description, badge]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, image, rating, stock, brand, category, description, badge } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, price=$2, image=$3, rating=$4, stock=$5,
       brand=$6, category=$7, description=$8, badge=$9 WHERE id=$10 RETURNING *`,
      [name, price, image, rating, stock, brand, category, description, badge, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Mahsulot topilmadi" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Mahsulot o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}