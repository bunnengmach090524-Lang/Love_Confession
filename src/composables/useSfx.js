let context

// A short, bright "ta-da" arpeggio for the happy ending. Generated in the browser, no audio file needed.
export function useSfx() {
  function chime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      context ??= new AudioContext()
      context.resume?.()

      const start = context.currentTime + 0.03
      ;[72, 76, 79, 84, 88].forEach((midi, i) => {
        const frequency = 440 * 2 ** ((midi - 69) / 12)
        const at = start + i * 0.11
        ;[
          { type: 'sine', mult: 1, level: 0.17 },
          { type: 'triangle', mult: 2, level: 0.04 },
        ].forEach(({ type, mult, level }) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = type
          oscillator.frequency.value = frequency * mult
          gain.gain.setValueAtTime(0.0001, at)
          gain.gain.exponentialRampToValueAtTime(level, at + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1)
          oscillator.connect(gain)
          gain.connect(context.destination)
          oscillator.start(at)
          oscillator.stop(at + 1.15)
        })
      })
    } catch {
      /* sound is a bonus; never break the page for it */
    }
  }

  return { chime }
}
