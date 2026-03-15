export async function sendTelegramMessage(message, botToken, chatId) {
  if (!botToken || !chatId) {
    console.warn('Telegram notifications skipped: Token or ChatID missing.');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
