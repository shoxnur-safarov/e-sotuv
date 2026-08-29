import { Request, Response } from "express";
import { sendTelegramNotification } from "../utils/telegram";
import pool from "../config/postgres";

export async function handleTelegramWebhook(req: Request, res: Response) {
    try {
        console.log("=== TELEGRAM WEBHOOK KELDI ===");
        console.log(JSON.stringify(req.body));

        const message = req.body?.message;
        if (!message) {
            console.log("Xabar topilmadi, chiqyapman");
            res.sendStatus(200);
            return;
        }

        const senderChatId = String(message.chat.id);
        const adminChatId = String(process.env.TELEGRAM_CHAT_ID);
        const text = message.text || "";

        console.log("Yuboruvchi ID:", senderChatId, "Admin ID:", adminChatId);

        if (senderChatId !== adminChatId) {
            console.log("Admin emas, javob berilmaydi");
            res.sendStatus(200);
            return;
        }

        if (text === "/start") {
            console.log("Start buyrug'i, javob yuborilmoqda");
            await sendTelegramNotification("👋 Xush kelibsiz, Admin!");
        }
        if (text === "/bugun") {
            const result = await pool.query(
                `SELECT COUNT(*) FROM contact_messages WHERE created_at >= CURRENT_DATE`
            );
            const count = result.rows[0].count;
            await sendTelegramNotification(`📊 Bugun kelgan xabarlar: <b>${count}</b> ta`);
        }

        if (text === "/hafta") {
            const result = await pool.query(
                `SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '7 days'`
            );
            const count = result.rows[0].count;
            await sendTelegramNotification(`📊 So'nggi 7 kunda kelgan xabarlar: <b>${count}</b> ta`);
        }

        if (text === "/oy") {
            const result = await pool.query(
                `SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '30 days'`
            );
            const count = result.rows[0].count;
            await sendTelegramNotification(`📊 So'nggi 30 kunda kelgan xabarlar: <b>${count}</b> ta`);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("WEBHOOK XATOSI:", err);
        res.sendStatus(200);
    }
}