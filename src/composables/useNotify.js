// Talks to /api/notify (→ Telegram). Never blocks or breaks her experience.
let lastSent = ''

async function post(payload) {
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Her choice ('yes' | 'think'). Fire-and-forget; skips duplicates. */
export async function sendAnswer(answer, locale) {
  if (answer === lastSent) return
  lastSent = answer
  if (!(await post({ answer, locale }))) lastSent = '' // allow a retry
}

/** Her optional written message. Resolves true/false so the UI can confirm. */
export const sendMessage = (message, locale) => post({ message, locale })
