// Vercel serverless function: sends her answer (and optional message) to your Telegram.
// The bot token lives ONLY in Vercel environment variables, never in the browser code.
const LABELS = {
  yes: '💗 She said: “I’d love to”',
  think: '🌷 She said: “Can I think about it?”',
}
const MAX_MESSAGE = 800

export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Open /api/notify in a browser to check the setup (never shows the secrets).
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, hasToken: Boolean(token), hasChatId: Boolean(chatId) })
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false })
  }
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing (redeploy after adding them)' })

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}
  const locale = body.locale === 'km' ? 'km' : 'en'
  const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Phnom_Penh', dateStyle: 'medium', timeStyle: 'short' })
  const footer = `(page language: ${locale === 'km' ? 'ខ្មែរ' : 'English'})\n🕐 ${time}`

  let text
  if (typeof body.message === 'string') {
    const message = body.message.trim().slice(0, MAX_MESSAGE)
    if (!message) return res.status(400).json({ ok: false, error: 'empty message' })
    text = `💌 A message from her:\n\n${message}\n\n${footer}`
  } else if (Object.hasOwn(LABELS, body.answer)) {
    text = `${LABELS[body.answer]}\n${footer}`
  } else {
    return res.status(400).json({ ok: false, error: 'invalid request' })
  }

  const result = await send(token, chatId, text)
  return res.status(result.sent ? 200 : 502).json({ ok: result.sent, telegram: result.telegram })
}

async function send(token, chatId, text) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    const data = await r.json().catch(() => ({}))
    // Telegram's description (e.g. "chat not found") never contains the token.
    return { sent: r.ok, telegram: r.ok ? 'sent' : data.description || `HTTP ${r.status}` }
  } catch {
    return { sent: false, telegram: 'network error' }
  }
}

function safeParse(text) {
  try { return JSON.parse(text) } catch { return {} }
}
