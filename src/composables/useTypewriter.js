import { computed, onBeforeUnmount, ref, unref } from 'vue'

// Khmer (and emoji) are built from several code points per visible character.
// Splitting by grapheme avoids cutting a letter in half while it "types".
function toGraphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), (part) => part.segment)
  }
  return Array.from(text)
}

export function useTypewriter(source, speed = 30) {
  const shown = ref(0)
  let timer
  const graphemes = computed(() => toGraphemes(unref(source)))

  const typed = computed(() => graphemes.value.slice(0, shown.value).join(''))
  const done = computed(() => shown.value >= graphemes.value.length)

  function stop() { clearInterval(timer) }

  function start() {
    stop()
    shown.value = 0
    timer = setInterval(() => {
      shown.value += 1
      if (done.value) stop()
    }, speed)
  }

  onBeforeUnmount(stop)
  return { typed, done, start, stop }
}
