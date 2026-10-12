import { ref } from 'vue'

const message = ref('')
let timer

export function useToast() {
  function showToast(text, duration = 2600) {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => { message.value = '' }, duration)
  }
  return { message, showToast }
}
