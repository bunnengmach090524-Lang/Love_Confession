<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useI18n } from '../../i18n'
import { useToast } from '../../composables/useToast'

const emit = defineEmits(['choose', 'back'])
const { t } = useI18n()
const { showToast } = useToast()

// "Can I think about it?" playfully runs away this many times, then settles and can be chosen.
// Set to 0 to disable the game. It is also disabled for people who prefer reduced motion.
const MAX_DODGES = 3
const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

const yesEl = ref(null)
const thinkEl = ref(null)
const backEl = ref(null)

const dodgesLeft = ref(reducedMotion ? 0 : MAX_DODGES)
const settled = ref(dodgesLeft.value === 0) // only now is the button really clickable
const moved = ref(false)
const pos = reactive({ x: 0, y: 0, r: 0, s: 1 })
let cooling = false
let timers = []

const thinkStyle = computed(() => (moved.value
  ? { transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg) scale(${pos.s})` }
  : null))

const overlaps = (a, b, pad = 10) =>
  a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad

// Find a spot that is on-screen and never covers the "Yes" button or the back link.
// The tilted button's bounding box is used, so even when it is rotated it cannot overlap them.
function pickSpot() {
  const el = thinkEl.value
  const box = el.getBoundingClientRect()
  const cx = box.left + box.width / 2 - pos.x // rotate/scale keep the centre, so subtract the shift
  const cy = box.top + box.height / 2 - pos.y
  const scale = Math.min(0.72, 190 / el.offsetWidth)
  const tilt = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 10)
  const rad = (Math.abs(tilt) * Math.PI) / 180
  const w = el.offsetWidth * scale
  const h = el.offsetHeight * scale
  const bw = w * Math.cos(rad) + h * Math.sin(rad) // bounding box of the tilted button
  const bh = w * Math.sin(rad) + h * Math.cos(rad)
  const avoid = [yesEl.value, backEl.value].map((node) => node.getBoundingClientRect())
  const vw = window.innerWidth
  const vh = window.innerHeight

  const minX = 14 + bw / 2 - cx
  const maxX = vw - 14 - bw / 2 - cx
  const minY = 64 + bh / 2 - cy // keep clear of the top bar
  const maxY = vh - 14 - bh / 2 - cy
  if (maxX <= minX || maxY <= minY) return null

  for (let i = 0; i < 80; i++) {
    const x = minX + Math.random() * (maxX - minX)
    const y = minY + Math.random() * (maxY - minY)
    if (Math.abs(x - pos.x) + Math.abs(y - pos.y) < 90) continue // must visibly move
    const rect = { left: cx + x - bw / 2, right: cx + x + bw / 2, top: cy + y - bh / 2, bottom: cy + y + bh / 2 }
    if (avoid.some((other) => overlaps(rect, other, 8))) continue
    return { x, y, r: tilt, s: scale }
  }
  return null
}

function dodge() {
  if (settled.value || cooling) return
  cooling = true
  timers.push(setTimeout(() => { cooling = false }, 450))
  dodgesLeft.value -= 1
  moved.value = true

  const spot = pickSpot()
  // No safe room (tiny screen)? Just wiggle in place instead of covering anything.
  Object.assign(pos, spot ?? { x: 0, y: 0, r: Math.random() < 0.5 ? -4 : 4, s: 0.85 })
  showToast(t('question.dodge'), 1500)

  if (dodgesLeft.value === 0) {
    // Out of tricks: it comes back home and can now be chosen.
    timers.push(setTimeout(() => {
      Object.assign(pos, { x: 0, y: 0, r: 0, s: 1 })
      settled.value = true
    }, 1300))
  }
}

function onThinkClick() {
  if (!settled.value) return dodge() // keyboard / stray taps while it is still playing
  emit('choose', 'think')
}

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <section class="story-screen question-screen">
    <div class="question-stars" aria-hidden="true">✦　·　✧　·　✦</div>
    <div class="big-glowing-heart" aria-hidden="true"><span>♥</span></div>
    <div class="eyebrow">{{ t('question.eyebrow') }}</div>
    <h2>{{ t('question.title') }}</h2>
    <p class="sublead">{{ t('question.sublead') }}</p>
    <div class="answer-buttons">
      <button ref="yesEl" class="answer-yes" type="button" @click="$emit('choose', 'yes')">
        {{ t('question.yes') }} <span>💗</span>
      </button>
      <button
        ref="thinkEl"
        class="answer-think"
        :class="{ dodgy: moved }"
        :style="thinkStyle"
        type="button"
        @pointerenter="$event.pointerType === 'mouse' && dodge()"
        @pointermove="$event.pointerType === 'mouse' && dodge()"
        @pointerdown="dodge()"
        @click="onThinkClick"
      >
        {{ t('question.think') }} <span>🌷</span>
      </button>
    </div>
    <button ref="backEl" class="text-button question-back" type="button" @click="$emit('back')">{{ t('question.readAgain') }}</button>
    <p class="tiny-note">{{ t('question.note') }}<br />{{ t('question.notify') }}</p>
  </section>
</template>
