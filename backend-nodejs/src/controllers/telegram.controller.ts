import { Request, Response } from "express";
import {
    sendTelegramNotification,
    sendTelegramMessageTo,
    sendTelegramMessageWithButtons,
    sendTelegramMessageWithInlineButtons,
    answerCallbackQuery,
} from "../utils/telegram";
import pool from "../config/postgres";

// Yordamchi funksiyani asosiy handler'dan tashqariga chiqardik
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
        const secretHeader = req.headers["x-telegram-bot-api-secret-token"];
        if (secretHeader !== process.env.TELEGRAM_WEBHOOK_SECRET) {
            res.sendStatus(401);
            return;
        }

        const adminChatId = String(process.env.TELEGRAM_CHAT_ID);

        // ===== CALLBACK QUERY (tugma bosilganda) =====
        const callbackQuery = req.body?.callback_query;
        if (callbackQuery) {
            const senderChatId = String(callbackQuery.message.chat.id);

            if (senderChatId !== adminChatId) {
                res.sendStatus(200);
                return;
            }

            const data: string = callbackQuery.data;
            const [action, targetChatId] = data.split("_");

            if (action === "approve") {
                await pool.query(
                    "UPDATE bot_users SET approval_status = 'approved', state = 'done' WHERE chat_id = $1",
                    [targetChatId]
                );
                await sendTelegramMessageWithButtons(
                    targetChatId,
                    "✅ So'rovingiz tasdiqlandi! Endi botdan foydalanishingiz mumkin.",
                    [["🛍 Mahsulotlarni ko'rish"]]
                );
                await answerCallbackQuery(callbackQuery.id, "Foydalanuvchi tasdiqlandi");
            }

            if (action === "reject") {
                await pool.query(
                    "UPDATE bot_users SET approval_status = 'rejected' WHERE chat_id = $1",
                    [targetChatId]
                );
                await sendTelegramMessageTo(targetChatId, "❌ Kechirasiz, so'rovingiz rad etildi.");
                await answerCallbackQuery(callbackQuery.id, "Foydalanuvchi rad etildi");
            }
            if (action === "delete") {
                await pool.query("DELETE FROM bot_users WHERE chat_id = $1", [targetChatId]);
                await answerCallbackQuery(callbackQuery.id, "Foydalanuvchi o'chirildi");
                await sendTelegramNotification(`🗑 Foydalanuvchi (Chat ID: ${targetChatId}) o'chirildi`);
            }

            res.sendStatus(200);
            return;
        }

        // ===== ODDIY XABAR =====
        const message = req.body?.message;
        if (!message) {
            res.sendStatus(200);
            return;
        }

        const senderChatId = String(message.chat.id);
        const text = (message.text || "").trim();

        // ===== ADMIN BO'LIMI =====
        if (senderChatId === adminChatId) {
            if (text === "/start" || text === "🏠 Bosh menyu") {
                await sendTelegramMessageWithButtons(
                    senderChatId,
                    "👋 <b>Xush kelibsiz, Admin!</b>\n\nKerakli bo'limni tanlang:",
                    [
                        ["📊 Bugungi statistika", "📅 Haftalik statistika"],
                        ["🗓 Oylik statistika", "📩 So'nggi xabarlar"],
                        ["📦 Mahsulotlar ro'yxati", "🆕 Yangi mahsulotlar"],
                        ["👥 Ro'yxatdan o'tganlar", "🗑 Foydalanuvchini o'chirish"],
                    ]
                );
            }

            if (text === "📊 Bugungi statistika") {
                const result = await pool.query(
                    "SELECT COUNT(*) FROM contact_messages WHERE created_at >= CURRENT_DATE"
                );
                await sendTelegramNotification(`📊 Bugun kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
            }

            if (text === "📅 Haftalik statistika") {
                const result = await pool.query(
                    "SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '7 days'"
                );
                await sendTelegramNotification(`📅 So'nggi 7 kunda kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
            }

            if (text === "🗓 Oylik statistika") {
                const result = await pool.query(
                    "SELECT COUNT(*) FROM contact_messages WHERE created_at >= NOW() - INTERVAL '30 days'"
                );
                await sendTelegramNotification(`🗓 So'nggi 30 kunda kelgan xabarlar: <b>${result.rows[0].count}</b> ta`);
            }

            if (text === "📩 So'nggi xabarlar") {
                await sendMessagesList("NOW() - INTERVAL '9999 days'", "Barcha vaqt");
            }

            if (text === "📦 Mahsulotlar ro'yxati") {
                const result = await pool.query("SELECT name, price, stock FROM products ORDER BY id DESC");
                if (result.rows.length === 0) {
                    await sendTelegramNotification("Hozircha mahsulotlar yo'q");
                } else {
                    let list = `📦 <b>Barcha mahsulotlar (${result.rows.length} ta):</b>\n\n`;
                    for (const row of result.rows) {
                        const priceFormatted = Number(row.price).toLocaleString("uz-UZ");
                        list += `• <b>${row.name}</b> — ${priceFormatted} so'm (${row.stock} ta)\n`;
                    }
                    await sendTelegramNotification(list);
                }
            }

            if (text === "🆕 Yangi mahsulotlar") {
                const result = await pool.query(
                    "SELECT name, price, stock FROM products WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY id DESC"
                );
                if (result.rows.length === 0) {
                    await sendTelegramNotification("So'nggi 7 kunda yangi mahsulot yo'q");
                } else {
                    let list = `🆕 <b>Yangi mahsulotlar (${result.rows.length} ta):</b>\n\n`;
                    for (const row of result.rows) {
                        const priceFormatted = Number(row.price).toLocaleString("uz-UZ");
                        list += `• <b>${row.name}</b> — ${priceFormatted} so'm (${row.stock} ta)\n`;
                    }
                    await sendTelegramNotification(list);
                }
            }

            if (text === "👥 Ro'yxatdan o'tganlar") {
                const result = await pool.query(
                    "SELECT name, phone, created_at FROM bot_users WHERE state = 'done' ORDER BY created_at DESC"
                );
                if (result.rows.length === 0) {
                    await sendTelegramNotification("Hozircha hech kim ro'yxatdan o'tmagan");
                } else {
                    let list = `👥 <b>Ro'yxatdan o'tganlar (${result.rows.length} ta):</b>\n\n`;
                    for (const row of result.rows) {
                        list += `• <b>${row.name}</b> — ${row.phone}\n`;
                    }
                    await sendTelegramNotification(list);
                }
            }

            if (text === "🗑 Foydalanuvchini o'chirish") {
                const result = await pool.query(
                    "SELECT chat_id, name, phone FROM bot_users ORDER BY created_at DESC"
                );
                if (result.rows.length === 0) {
                    await sendTelegramNotification("Hozircha foydalanuvchilar yo'q");
                } else {
                    const buttons = result.rows.map((row) => [
                        { text: `🗑 ${row.name || "Noma'lum"} (${row.phone || "—"})`, callback_data: `delete_${row.chat_id}` },
                    ]);
                    await sendTelegramMessageWithInlineButtons(
                        adminChatId,
                        "O'chirmoqchi bo'lgan foydalanuvchini tanlang:",
                        buttons
                    );
                }
            }

            res.sendStatus(200);
            return;
        }

        // ===== ADMIN EMAS — ONBOARDING / TASDIQLASH / MIJOZ MENYUSI =====
        const userResult = await pool.query("SELECT * FROM bot_users WHERE chat_id = $1", [senderChatId]);

        if (userResult.rows.length === 0) {
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
            await pool.query("UPDATE bot_users SET phone = $1, state = 'awaiting_purpose' WHERE chat_id = $2", [text, senderChatId]);
            await sendTelegramMessageTo(senderChatId, "Nega botdan foydalanmoqchisiz? Qisqacha yozing:");
            res.sendStatus(200);
            return;
        }

        if (botUser.state === "awaiting_purpose") {
            await pool.query("UPDATE bot_users SET purpose = $1, state = 'pending_approval' WHERE chat_id = $2", [text, senderChatId]);
            await sendTelegramMessageTo(senderChatId, "So'rovingiz adminga yuborildi. Tez orada javob berishadi ⏳");

            const updatedUser = await pool.query("SELECT name, phone FROM bot_users WHERE chat_id = $1", [senderChatId]);
            const u = updatedUser.rows[0];

            await sendTelegramMessageWithInlineButtons(
                adminChatId,
                `🔔 <b>Yangi so'rov!</b>\n\n👤 Ism: ${u.name}\n📱 Telefon: ${u.phone}\n💬 Maqsad: ${text}`,
                [
                    [
                        { text: "✅ Ruxsat berish", callback_data: `approve_${senderChatId}` },
                        { text: "❌ Rad etish", callback_data: `reject_${senderChatId}` },
                    ],
                ]
            );

            res.sendStatus(200);
            return;
        }

        if (botUser.state === "pending_approval") {
            await sendTelegramMessageTo(senderChatId, "So'rovingiz hali ko'rib chiqilmoqda. Iltimos, kuting ⏳");
            res.sendStatus(200);
            return;
        }

        if (botUser.approval_status === "rejected") {
            await sendTelegramMessageTo(senderChatId, "Kechirasiz, so'rovingiz rad etilgan.");
            res.sendStatus(200);
            return;
        }

        // ===== approval_status === 'approved' — mijoz menyusi =====
        if (text === "🏠 Bosh menyu" || text === "/start") {
            await sendTelegramMessageWithButtons(
                senderChatId,
                "Assalomu alaykum! Quyidagi tugmalardan foydalaning:",
                [["🛍 Mahsulotlarni ko'rish"]]
            );
        } else if (text === "🛍 Mahsulotlarni ko'rish") {
            await sendTelegramMessageWithButtons(
                senderChatId,
                "Qaysi kategoriyani ko'rmoqchisiz?",
                [
                    ["⌚ Watches", "🎧 Audio"],
                    ["💻 Laptops", "📱 Tablets"],
                    ["⌨️ Keyboards", "🎒 Accessories"],
                    ["🏠 Bosh menyu"],
                ]
            );
        } else if (
            ["⌚ Watches", "🎧 Audio", "💻 Laptops", "📱 Tablets", "⌨️ Keyboards", "🎒 Accessories"].includes(text)
        ) {
            const categoryMap: Record<string, string> = {
                "⌚ Watches": "Watches",
                "🎧 Audio": "Audio",
                "💻 Laptops": "Laptops",
                "📱 Tablets": "Tablets",
                "⌨️ Keyboards": "Keyboards",
                "🎒 Accessories": "Accessories",
            };
            const category = categoryMap[text];

            const result = await pool.query(
                "SELECT name, price, stock FROM products WHERE category = $1 AND stock > 0 ORDER BY id DESC LIMIT 10",
                [category]
            );

            if (result.rows.length === 0) {
                await sendTelegramMessageTo(senderChatId, `${category} kategoriyasida hozircha mahsulot yo'q`);
            } else {
                await sendTelegramMessageTo(senderChatId, `🛍 <b>${category} (${result.rows.length} ta):</b>`);
                for (const row of result.rows) {
                    const priceFormatted = Number(row.price).toLocaleString("uz-UZ");
                    await sendTelegramMessageTo(
                        senderChatId,
                        `📦 <b>${row.name}</b>\n💰 ${priceFormatted} so'm\n📊 Omborda: ${row.stock} ta`
                    );
                }
            }

            await sendTelegramMessageWithButtons(senderChatId, "Yana ko'rishni xohlaysizmi?", [
                ["🛍 Mahsulotlarni ko'rish"],
                ["🏠 Bosh menyu"],
            ]);
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