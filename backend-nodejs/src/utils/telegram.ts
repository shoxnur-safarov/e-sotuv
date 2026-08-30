export async function sendTelegramNotification(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram sozlamalari topilmadi (.env tekshiring)");
    return;
  }

  try {
    const url = "https://api.telegram.org/bot" + token + "/sendMessage";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });
    const data = await response.json();
    console.log("TELEGRAM JAVOBI:", JSON.stringify(data));
  } catch (err) {
    console.error("TELEGRAM XATOSI:", err);
  }
}
export async function sendTelegramMessageTo(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("Telegram xabar yuborishda xatolik:", err);
  }
}
export async function sendTelegramMessageWithButtons(chatId: string, text: string, buttons: string[][]) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: {
          keyboard: buttons.map((row) => row.map((label) => ({ text: label }))),
          resize_keyboard: true,
        },
      }),
    });
  } catch (err) {
    console.error("Telegram xabar yuborishda xatolik:", err);
  }
}
export async function sendTelegramMessageWithInlineButtons(
  chatId: string,
  text: string,
  buttons: { text: string; callback_data: string }[][]
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: buttons },
      }),
    });
  } catch (err) {
    console.error("Telegram xabar yuborishda xatolik:", err);
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: text || "" }),
    });
  } catch (err) {
    console.error("Callback javobida xatolik:", err);
  }
}