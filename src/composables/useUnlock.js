/** Asks the server whether the secret word is right → 'ok' | 'wrong' | 'error'. */
export async function checkPassword(password) {
  try {
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) return 'ok'
    return res.status === 401 ? 'wrong' : 'error'
  } catch {
    return 'error'
  }
}
