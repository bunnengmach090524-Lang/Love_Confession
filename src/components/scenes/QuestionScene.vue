<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { CONFIG } from '../../config'
import { useI18n } from '../../i18n'

const emit = defineEmits(['choose', 'back'])
const { t, messages } = useI18n()

// "Can I think about it?" playfully hops away up to MAX_DODGES times, then stays put and works.
// Keyboard users, and people who prefer reduced motion, never see it move.
const MAX_DODGES = 3
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const yesButton = ref(null)
const thinkButton = ref(null)
const dodges = ref(0)
const offset = reactive({ x: 0, y: 0 })
const mountedAt = Date.now()
let lastDodgeAt = 0
let justDodged = false // a touch tap that made it hop must not also count as a click
let flagTimer
let returnTimer

function overlaps(a, b, gap = 10) {
  return a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap
}

const between = (min, max) => (max <= min ? min : min + Math.random() * (max - min))

function dodge(event) {
  const button = thinkButton.value
  if (reduceMotion || !button || dodges.value >= MAX_DODGES) return
  // Ignore a cursor that was simply resting here when the scene appeared, and let each hop finish
  // before the next (a layout change under a resting pointer can fire "enter" again).
  const now = Date.now()
  if (now - mountedAt < 800 || now - lastDodgeAt < 500) return

  const rect = button.getBoundingClientRect()
  const homeLeft = rect.left - offset.x
  const homeTop = rect.top - offset.y
  const pointer = { x: event?.clientX ?? -999, y: event?.clientY ?? -999 }
  const pointerBox = { left: pointer.x, right: pointer.x, top: pointer.y, bottom: pointer.y }
  const yesRect = yesButton.value?.getBoundingClientRect()
  const margin = 12

  // How far it may travel while staying fully on screen (on a phone it is almost full width, so it hops up and down).
  const xMin = Math.max(-130, margin - homeLeft)
  const xMax = Math.min(130, window.innerWidth - margin - rect.width - homeLeft)
  const yMin = Math.max(-100, margin - homeTop)
  const yMax = Math.min(140, window.innerHeight - margin - rect.height - homeTop)

  let target = null
  for (let i = 0; i < 40 && !target; i += 1) {
    const x = xMin > xMax ? 0 : between(xMin, xMax)
    const y = between(yMin, yMax)
    const box = { left: homeLeft + x, top: homeTop + y, right: homeLeft + x + rect.width, bottom: homeTop + y + rect.height }
    const farEnough = Math.hypot(x - offset.x, y - offset.y) > 60
    const awayFromPointer = !overlaps(box, pointerBox, 16) // really get out from under the finger or cursor
    const clearOfYes = !(yesRect && overlaps(box, yesRect))
    if (farEnough && awayFromPointer && clearOfYes) target = { x, y }
  }
  // Fallback: flip to the other side of where it is now, still inside the screen.
  target ??= { x: 0, y: Math.min(Math.max(offset.y > 0 ? -90 : 90, yMin), yMax) }

  offset.x = target.x
  offset.y = target.y
  dodges.value += 1

  lastDodgeAt = now
  justDodged = true
  clearTimeout(flagTimer)
  flagTimer = setTimeout(() => { justDodged = false }, 500)

  if (dodges.value === MAX_DODGES) {
    clearTimeout(returnTimer)
    returnTimer = setTimeout(() => { offset.x = 0; offset.y = 0 }, 1100)
  }
}

function onThink() {
  if (justDodged) return
  emit('choose', 'think')
}

onBeforeUnmount(() => {
  clearTimeout(flagTimer)
  clearTimeout(returnTimer)
})
</script>

<template>
  <section class="story-screen question-screen">
    <div class="question-stars" aria-hidden="true">✦　·　✧　·　✦</div>
    <div class="big-glowing-heart" aria-hidden="true"><span>♥</span></div>
    <div class="eyebrow">{{ t('question.eyebrow') }}</div>
    <h2>{{ t('question.title') }}</h2>
    <p class="sublead">{{ t('question.sublead') }}</p>
    <div class="answer-buttons">
      <button ref="yesButton" class="answer-yes" type="button" @click="$emit('choose', 'yes')">
        {{ t('question.yes') }} <span>💗</span>
      </button>
      <button
        ref="thinkButton"
        class="answer-think"
        type="button"
        :style="{ '--dx': `${offset.x}px`, '--dy': `${offset.y}px` }"
        @pointerenter="dodge"
        @click="onThink"
      >
        {{ t('question.think') }} <span>🌷</span>
      </button>
    </div>
    <p class="dodge-message" aria-live="polite">{{ dodges > 0 ? messages.question.dodge[dodges - 1] : '' }}</p>
    <button class="text-button question-back" type="button" @click="$emit('back')">{{ t('question.readAgain') }}</button>
    <p class="tiny-note">{{ t(CONFIG.notify ? 'question.note' : 'question.noteLocal') }}</p>
  </section>
</template>
