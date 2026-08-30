import { Request, Response } from "express";
import { sendTelegramNotification, sendTelegramMessageTo } from "../utils/telegram";
import pool from "../config/postgres";
import { sendTelegramMessageWithButtons } from "../utils/telegram";

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
            if (text === "/mahsulotlar_soni") {
                const result = await pool.query("SELECT COUNT(*) FROM products");
                await sendTelegramNotification(`📦 Jami mahsulotlar: <b>${result.rows[0].count}</b> ta`);
            }

            if (text === "/mahsulotlar_royxati") {
                const result = await pool.query("SELECT name, price, stock FROM products ORDER BY id DESC");
                if (result.rows.length === 0) {
                    await sendTelegramNotification("Hozircha mahsulotlar yo'q");
                } else {
                    let list = `📦 <b>Barcha mahsulotlar (${result.rows.length} ta):</b>\n\n`;
                    for (const row of result.rows) {
                        list += `• ${row.name} — ${row.price} so'm (${row.stock} ta)\n`;
                    }
                    await sendTelegramNotification(list);
                }
            }

            if (text === "/yangi_mahsulotlar_soni") {
                const result = await pool.query("SELECT COUNT(*) FROM products WHERE created_at >= NOW() - INTERVAL '7 days'");
                await sendTelegramNotification(`🆕 So'nggi 7 kunda qo'shilgan mahsulotlar: <b>${result.rows[0].count}</b> ta`);
            }

            if (text === "/yangi_mahsulotlar_royxati") {
                const result = await pool.query("SELECT name, price, stock FROM products WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY id DESC");
                if (result.rows.length === 0) {
                    await sendTelegramNotification("So'nggi 7 kunda yangi mahsulot yo'q");
                } else {
                    let list = `🆕 <b>Yangi mahsulotlar (${result.rows.length} ta):</b>\n\n`;
                    for (const row of result.rows) {
                        list += `• ${row.name} — ${row.price} so'm (${row.stock} ta)\n`;
                    }
                    await sendTelegramNotification(list);
                }
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
            await sendTelegramMessageWithButtons(
                senderChatId,
                "Ro'yxatdan o'tish yakunlandi! 🎉\n\nQuyidagi tugmalardan foydalaning:",
                [["🛍 Mahsulotlarni ko'rish"]]
            );
            res.sendStatus(200);
            return;
        }

        // state === 'done' bo'lsa
        if (text === "🛍 Mahsulotlarni ko'rish") {
            const result = await pool.query("SELECT name, price, stock FROM products WHERE stock > 0 ORDER BY id DESC LIMIT 10");
            if (result.rows.length === 0) {
                await sendTelegramMessageTo(senderChatId, "Hozircha mahsulotlar mavjud emas");
            } else {
                await sendTelegramMessageTo(senderChatId, `🛍 <b>Mavjud mahsulotlar (${result.rows.length} ta):</b>`);
                for (const row of result.rows) {
                    const priceFormatted = Number(row.price).toLocaleString("uz-UZ");
                    await sendTelegramMessageTo(
                        senderChatId,
                        `📦 <b>${row.name}</b>\n💰 ${priceFormatted} so'm\n📊 Omborda: ${row.stock} ta`
                    );
                }
                await sendTelegramMessageWithButtons(senderChatId, "Yana ko'rishni xohlaysizmi?", [["🛍 Mahsulotlarni ko'rish"]]);
            }
        } else {
            await sendTelegramMessageWithButtons(
                senderChatId,
                "Quyidagi tugmalardan foydalaning:",
                [["🛍 Mahsulotlarni ko'rish"]]
            );
        }
        res.sendStatus(200);
    } catch (err) {
        console.error("WEBHOOK XATOSI:", err);
        res.sendStatus(200);
    }
}