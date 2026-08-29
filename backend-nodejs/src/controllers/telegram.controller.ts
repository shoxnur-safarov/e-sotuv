import { Request, Response } from "express";
import { sendTelegramNotification, sendTelegramMessageTo } from "../utils/telegram";
import pool from "../config/postgres";

async function sendMessagesList(interval: string, label: string) {
  const result = await pool.query(
    `SELECT name, email, message, created_at FROM contact_messages WHERE created_at >= ${interval} ORDER BY created_at DESC`
  );
  if (result.rows.length === 0) {
    await sendTelegramNotification(`${label} uchun xabarlar yo'q`);
    return;
  }
  let text = `📋 <b>${label} kelgan xabarlar (${result.rows.length} ta):</b>\n\n`;
  for (const row of result.rows) {
    const date = new Date(row.created_at).toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    text += `👤 ${row.name}\n📧 ${row.email}\n💬 ${row.message || "—"}\n🕐 ${date}\n\n`;
  }
  await sendTelegramNotification(text);
}

export async function handleTelegramWebhook(req: Request, res: Response) {
  try {
    const message = req.body?.message;
    if (!message) {
      res.sendStatus(200);
      return;
    }

    const senderChatId = String(message.chat.id);
    const adminChatId = String(process.env.TELEGRAM_CHAT_ID);
    const text = (message.text || "").trim();

    // ADMIN BO'LSA — eski mantiq ishlaydi
    if (senderChatId === adminChatId) {
      if (text === "/start") {
        await sendTelegramNotification("👋 Xush kelibsiz, Admin!");
      }
      if (text === "/bugun") {
        const result = await pool.query(`SELECT COUNT(*) FROM contact_messages WHERE created_at >= CURRENT_DATE`);
        await sendTelegramNotification(`📊 Bugun kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
      }
      if (text === "/hafta") {
        const result = await pool.query(`SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '7 days'`);
        await sendTelegramNotification(`📊 So'nggi 7 kunda kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
      }
      if (text === "/oy") {
        const result = await pool.query(`SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '30 days'`);
        await sendTelegramNotification(`📊 So'nggi 30 kunda kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
      }
      if (text === "/oxirgi") {
        await sendMessagesList("NOW() - INTERVAL '9999 days'", "Barcha vaqt");
      }
      if (text === "/bugun_xabarlar") {
        await sendMessagesList("CURRENT_DATE", "Bugun");
      }
      if (text === "/hafta_xabarlar") {
        await sendMessagesList("NOW() - INTERVAL '7 days'", "So'nggi 7 kunda");
      }
      if (text === "/oy_xabarlar") {
        await sendMessagesList("NOW() - INTERVAL '30 days'", "So'nggi 30 kunda");
      }
      res.sendStatus(200);
      return;
    }

    // ADMIN EMAS — ONBOARDING JARAYONI
    const userResult = await pool.query("SELECT * FROM bot_users WHERE chat_id = $1", [senderChatId]);

    if (userResult.rows.length === 0) {
      // Yangi foydalanuvchi — ismini so'raymiz
      await pool.query("INSERT INTO bot_users (chat_id, state) VALUES ($1, 'awaiting_name')", [senderChatId]);
      await sendTelegramMessageTo(senderChatId, "Salom! Botdan foydalanish uchun avval ismingizni kiriting:");
      res.sendStatus(200);
      return;
    }

    const botUser = userResult.rows[0];

    if (botUser.state === "awaiting_name") {
      await pool.query("UPDATE bot_users SET name = $1, state = 'awaiting_phone' WHERE chat_id = $2", [text, senderChatId]);
      await sendTelegramMessageTo(senderChatId, `Rahmat, ${text}! Endi telefon raqamingizni kiriting (masalan +998901234567):`);
      res.sendStatus(200);
      return;
    }

    if (botUser.state === "awaiting_phone") {
      await pool.query("UPDATE bot_users SET phone = $1, state = 'done' WHERE chat_id = $2", [text, senderChatId]);
      await sendTelegramMessageTo(senderChatId, "Ro'yxatdan o'tish yakunlandi! Savollaringiz bo'lsa, @shoxnursafarov bilan bog'laning.");
      res.sendStatus(200);
      return;
    }

    // state === 'done' bo'lsa
    await sendTelegramMessageTo(senderChatId, "Siz allaqachon ro'yxatdan o'tgansiz. Savollaringiz bo'lsa, @shoxnursafarov bilan bog'laning.");
    res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK XATOSI:", err);
    res.sendStatus(200);
  }
}