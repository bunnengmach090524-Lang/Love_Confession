import { ref } from 'vue'
import { CONFIG } from '../config'

const initial = () => (CONFIG.notify ? 'idle' : 'off')

/** Tells the owner (via the /api/notify serverless function) which answer was chosen. */
export function useNotify() {
  const status = ref(initial()) // 'off' | 'idle' | 'sending' | 'sent' | 'failed'

  async function send(answer) {
    if (!CONFIG.notify) return
    status.value = 'sending'
    try {
      const response = await fetch(CONFIG.notifyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
        signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(8000) : undefined,
      })
      status.value = response.ok ? 'sent' : 'failed'
    } catch {
      status.value = 'failed'
    }
  }

  function reset() {
    status.value = initial()
  }

  return { status, send, reset }
}
