import { onBeforeUnmount, ref } from 'vue'

// Plays public/music.mp3 (Folk_Tales - "Love - Family Love_35Sec") on loop.
// If the mp3 is missing or fails to load, it falls back to a harp-style
// loop generated in the browser so the music button always works.
const MUSIC_URL = `${import.meta.env.BASE_URL}music.mp3`
const MUSIC_VOLUME = 0.35
const melody = [
  76, 79, 83, 84, 83, 79, 76, 74,
  72, 76, 79, 81, 79, 76, 74, 72,
]

const chords = [
  [60, 64, 67], // C major
  [69, 72, 76], // A minor
  [65, 69, 72], // F major
  [67, 71, 74], // G major
]

const midiToFrequency = (midi) => 440 * (2 ** ((midi - 69) / 12))

export function useMusic({ onError } = {}) {
  const playing = ref(false)
  let context
  let masterGain
  let scheduler
  let nextNoteTime = 0
  let step = 0
  const activeNodes = new Set()
  let audio // HTMLAudioElement for the mp3
  let useSynth = false // true when the mp3 failed and we use the generated loop

  function playHarpNote(midi, startTime, duration, volume) {
    const endTime = startTime + duration

    ;[
      { type: 'sine', harmonic: 1, level: 1 },
      { type: 'triangle', harmonic: 2, level: 0.11 },
    ].forEach(({ type, harmonic, level }) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(midiToFrequency(midi) * harmonic, startTime)
      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.exponentialRampToValueAtTime(volume * level, startTime + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime)

      oscillator.connect(gain)
      gain.connect(masterGain)
      oscillator.start(startTime)
      oscillator.stop(endTime + 0.03)
      activeNodes.add(oscillator)
      oscillator.addEventListener('ended', () => activeNodes.delete(oscillator), { once: true })
    })
  }

  function scheduleStep() {
    const beat = 60 / 72
    const noteLength = beat / 2
    const melodyNote = melody[step % melody.length]
    const chord = chords[Math.floor(step / 4) % chords.length]
    const accompaniment = chord[step % chord.length]

    playHarpNote(melodyNote, nextNoteTime, noteLength * 0.92, 0.11)
    playHarpNote(accompaniment, nextNoteTime, noteLength * 0.96, 0.026)

    if (step % 4 === 0) {
      playHarpNote(chord[0] - 12, nextNoteTime, noteLength * 3.6, 0.035)
    }

    nextNoteTime += noteLength
    step += 1
  }

  function fillSchedule() {
    while (nextNoteTime < context.currentTime + 0.35) scheduleStep()
  }

  function stop() {
    audio?.pause()
    window.clearInterval(scheduler)
    scheduler = undefined
    activeNodes.forEach((node) => node.stop())
    activeNodes.clear()
    playing.value = false
  }

  async function startSynth() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) throw new Error('Web Audio is not supported')

    context ??= new AudioContext()
    if (!masterGain) {
      masterGain = context.createGain()
      masterGain.connect(context.destination)
    }
    masterGain.gain.setValueAtTime(0.22, context.currentTime)
    await context.resume()

    step = 0
    nextNoteTime = context.currentTime + 0.05
    fillSchedule()
    scheduler = window.setInterval(fillSchedule, 120)
  }

  async function startMp3() {
    if (!audio) {
      audio = new Audio(MUSIC_URL)
      audio.loop = true
      audio.volume = MUSIC_VOLUME
      audio.preload = 'auto'
    }
    await audio.play() // rejects if the file is missing or the browser blocks it
  }

  async function toggle() {
    if (playing.value) {
      stop()
      return
    }

    try {
      if (!useSynth) {
        try {
          await startMp3()
        } catch (err) {
          // Autoplay policy is a user-gesture problem, not a missing file.
          if (err?.name === 'NotAllowedError') throw err
          console.warn('music.mp3 unavailable, using generated music instead:', err)
          audio = undefined
          useSynth = true
        }
      }
      if (useSynth) await startSynth()
      playing.value = true
    } catch (err) {
      console.error(err)
      stop()
      onError?.()
    }
  }

  onBeforeUnmount(() => {
    stop()
    audio = undefined
    context?.close()
  })
  return { playing, toggle }
}
