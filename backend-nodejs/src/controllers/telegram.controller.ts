import { Request, Response } from "express";
import { sendTelegramNotification } from "../utils/telegram";

export async function handleTelegramWebhook(req: Request, res: Response) {
  const message = req.body?.message;

  if (!message) {
    res.sendStatus(200);
    return;
  }

  const senderChatId = String(message.chat.id);
  const adminChatId = process.env.TELEGRAM_CHAT_ID;
  const text = message.text || "";

  // XAVFSIZLIK TEKSHIRUVI — faqat admin uchun ishlaydi
  if (senderChatId !== adminChatId) {
    res.sendStatus(200);
    return;
  }

  if (text === "/start") {
    await sendTelegramNotification("👋 Xush kelibsiz, Admin! Sizga quyidagi buyruqlar mavjud:\n/bugun\n/hafta\n/oy");
  }

  res.sendStatus(200);
}