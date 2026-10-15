// Vercel serverless function: sends her answer to your Telegram.
// The bot token lives ONLY in Vercel environment variables, never in the browser code.
const LABELS = {
  yes: { en: '💗 She said: “I’d love to”', km: '💗 នាងឆ្លើយថា៖ “ខ្ញុំចង់ណាស់”' },
  think: { en: '🌷 She said: “Can I think about it?”', km: '🌷 នាងឆ្លើយថា៖ “សូមឱ្យខ្ញុំគិតសិន”' },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'not configured' })

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}
  const answer = body.answer
  const locale = body.locale === 'km' ? 'km' : 'en'
  if (!Object.hasOwn(LABELS, answer)) return res.status(400).json({ ok: false, error: 'invalid answer' })

  const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Phnom_Penh', dateStyle: 'medium', timeStyle: 'short' })
  const text = `${LABELS[answer].en}\n(page language: ${locale === 'km' ? 'ខ្មែរ' : 'English'})\n🕐 ${time}`

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    if (!r.ok) return res.status(502).json({ ok: false })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false })
  }
}

function safeParse(text) {
  try { return JSON.parse(text) } catch { return {} }
}
