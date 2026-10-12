// Fails if en.js and km.js don't have exactly the same keys (a missing translation shows the raw key).
import en from '../src/i18n/en.js'
import km from '../src/i18n/km.js'

function keys(node, prefix = '') {
  if (Array.isArray(node)) return node.flatMap((item, i) => keys(item, `${prefix}[${i}]`))
  if (node && typeof node === 'object') return Object.entries(node).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
  return [prefix]
}
const a = new Set(keys(en)), b = new Set(keys(km))
const missingInKm = [...a].filter((k) => !b.has(k))
const missingInEn = [...b].filter((k) => !a.has(k))
if (missingInKm.length || missingInEn.length) {
  if (missingInKm.length) console.error('Missing in km.js:\n  ' + missingInKm.join('\n  '))
  if (missingInEn.length) console.error('Missing in en.js:\n  ' + missingInEn.join('\n  '))
  process.exit(1)
}
console.log(`i18n OK — ${a.size} keys in both languages`)
