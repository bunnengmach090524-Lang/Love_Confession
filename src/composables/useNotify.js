// Tells the author (via /api/notify → Telegram) which answer she chose.
// Fire-and-forget: if it fails, her experience is never interrupted.
let lastSent = ''

export async function sendAnswer(answer, locale) {
  if (answer === lastSent) return // don't spam if she restarts and picks the same thing
  lastSent = answer
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, locale }),
    })
    if (!res.ok) lastSent = '' // allow a retry on the next tap
  } catch {
    lastSent = ''
  }
}
