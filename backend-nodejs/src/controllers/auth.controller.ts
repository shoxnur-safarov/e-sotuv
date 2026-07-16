import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/postgres";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role = "USER" } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email va parol majburiy" });
      return;
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      res.status(400).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email va parol majburiy" });
      return;
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ message: "Email yoki parol noto'g'ri" });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Email yoki parol noto'g'ri" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const result = await pool.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}