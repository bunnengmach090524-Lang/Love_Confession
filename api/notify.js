// Vercel serverless function: forwards her answer to your Telegram chat.
// The bot token lives only in Vercel's environment variables — never in the page code.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return res.status(503).json({ ok: false, error: 'not configured' })

  const answer = req.body?.answer
  if (answer !== 'yes' && answer !== 'think') return res.status(400).json({ ok: false })

  const name = process.env.RECIPIENT_NAME || 'Lihor'
  const text = answer === 'yes' ? `💗 ${name} said YES!` : `🌷 ${name} would like some time to think.`

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    return res.status(telegram.ok ? 200 : 502).json({ ok: telegram.ok })
  } catch {
    return res.status(502).json({ ok: false })
  }
}
