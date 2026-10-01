// Vercel serverless function: saytdagi formadan kelgan lidni Telegramga yuboradi.
// Kerakli Environment Variables (Vercel > Project > Settings > Environment Variables):
//   TELEGRAM_BOT_TOKEN  — BotFather bergan token
//   TELEGRAM_CHAT_ID    — lid boradigan chat ID (bir nechta bo'lsa vergul bilan: 123,456)

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Spam-botlarga qarshi: yashirin maydon to'ldirilgan yoki forma juda tez yuborilgan bo'lsa — jim qabul qilamiz
  if (body.hp) return res.status(200).json({ ok: true });
  if (typeof body.elapsed === 'number' && body.elapsed < 2500) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  let digits = String(body.phone || '').replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;

  if (name.length < 2) return res.status(400).json({ ok: false, error: 'name' });
  if (!/^998\d{9}$/.test(digits)) return res.status(400).json({ ok: false, error: 'phone' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = String(process.env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    console.error('Telegram sozlanmagan: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo\'q');
    return res.status(503).json({ ok: false, error: 'config' });
  }

  const pretty = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  const src = String(body.src || 'sayt').replace(/[^\w-]/g, '').slice(0, 30) || 'sayt';
  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

  const text =
    `<b>Yangi lid — inCruises sayti</b>\n\n` +
    `Ism: ${escapeHtml(name)}\n` +
    `Telefon: ${pretty}\n` +
    `Manba: ${escapeHtml(src)}\n` +
    `Vaqt: ${time}`;

  const results = await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      })
        .then(async (r) => {
          if (!r.ok) console.error('Telegram xatosi', chatId, r.status, await r.text());
          return r.ok;
        })
        .catch((e) => {
          console.error('Telegram so\'rovi bajarilmadi', chatId, e);
          return false;
        })
    )
  );

  if (!results.some(Boolean)) return res.status(502).json({ ok: false, error: 'telegram' });
  return res.status(200).json({ ok: true });
};
