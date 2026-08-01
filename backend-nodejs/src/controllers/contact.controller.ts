import { Request, Response } from "express";
import pool from "../config/postgres";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Email noto'g'ri formatda"),
  company: z.string().optional(),
  message: z.string().optional(),
});

export async function createContactMessage(req: Request, res: Response) {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message });
      return;
    }
    const { name, email, company, message } = parsed.data;

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, company, message) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, company || null, message || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getContactMessages(req: Request, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}