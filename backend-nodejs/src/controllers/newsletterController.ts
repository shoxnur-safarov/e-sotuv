import { Request, Response } from 'express';
import pool from '../config/postgres'; // bazaga ulanish faylingiz yo'li

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Noto'g'ri email kiritildi" });
    }

    // Neon PostgreSQL bazasiga saqlash
    await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email]
    );

    return res.status(200).json({ message: "Muvaffaqiyatli obuna bo'ldingiz!" });
  } catch (error) {
    console.error('Newsletter Error:', error);
    return res.status(500).json({ error: 'Server xatoligi yuz berdi' });
  }
};