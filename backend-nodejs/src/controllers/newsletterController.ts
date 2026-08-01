import { Request, Response } from "express";
import pool from "../config/postgres";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
});

export async function subscribeNewsletter(req: Request, res: Response) {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message });
      return;
    }
    const { email } = parsed.data;

    await pool.query(
      "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email]
    );

    res.status(200).json({ message: "Muvaffaqiyatli obuna bo'ldingiz!" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}