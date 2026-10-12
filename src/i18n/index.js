import { computed, ref, watchEffect } from 'vue'
import en from './en.js'
import km from './km.js'

const messages = { en, km }
export const SUPPORTED_LOCALES = ['en', 'km']
const STORAGE_KEY = 'love-story-locale'

function detectInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED_LOCALES.includes(saved)) return saved
  } catch { /* storage can be blocked (private mode) */ }
  return navigator.language?.toLowerCase().startsWith('km') ? 'km' : 'en'
}

// Module-level state: every component shares the same language.
const locale = ref(detectInitialLocale())
const current = computed(() => messages[locale.value])

function lookup(path) {
  return path.split('.').reduce((node, key) => node?.[key], current.value)
}

/** t('letter.hi', { name: 'Dara' }) → "Hi, Dara." */
function t(path, params = {}) {
  const value = lookup(path)
  if (typeof value !== 'string') return path
  return value.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`)
}

function setLocale(next) {
  if (!SUPPORTED_LOCALES.includes(next)) return
  locale.value = next
  try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
}

// Keep <html lang>, the tab title and the meta description in sync.
watchEffect(() => {
  document.documentElement.lang = locale.value
  document.title = current.value.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', current.value.meta.description)
})

export function useI18n() {
  return { locale, messages: current, t, setLocale, SUPPORTED_LOCALES }
}
