// Vercel serverless function: checks the "secret word" that opens the letter.
// The word lives ONLY in the Vercel environment variable SITE_PASSWORD (not in the browser code).
// You can allow several spellings: SITE_PASSWORD=sunflower,sun flower
import { createHash, timingSafeEqual } from 'node:crypto'

const normalize = (text) => String(text ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase()
const digest = (text) => createHash('sha256').update(text).digest()

export default async function handler(req, res) {
  const configured = process.env.SITE_PASSWORD

  // Open /api/unlock in a browser to check the setup (never shows the password).
  if (req.method === 'GET') return res.status(200).json({ ok: true, hasPassword: Boolean(configured) })

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false })
  }
  if (!configured) return res.status(500).json({ ok: false, error: 'SITE_PASSWORD missing (add it in Vercel, then redeploy)' })

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}
  const attempt = digest(normalize(String(body.password ?? '').slice(0, 200)))
  const ok = configured.split(',').some((word) => timingSafeEqual(attempt, digest(normalize(word))))

  if (!ok) {
    await new Promise((resolve) => setTimeout(resolve, 700)) // slows down guessing
    return res.status(401).json({ ok: false })
  }
  return res.status(200).json({ ok: true })
}

function safeParse(text) {
  try { return JSON.parse(text) } catch { return {} }
}
