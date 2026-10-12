<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ConfettiBurst from '../ConfettiBurst.vue'
import { useI18n } from '../../i18n'
import { useSfx } from '../../composables/useSfx'

const props = defineProps({
  answer: { type: String, default: 'think' },
  sound: { type: Boolean, default: true },
  notifyStatus: { type: String, default: 'off' }, // 'off' | 'idle' | 'sending' | 'sent' | 'failed'
})
defineEmits(['restart'])
const { t, messages } = useI18n()
const { chime } = useSfx()

const isYes = computed(() => props.answer === 'yes')
const copy = computed(() => messages.value.ending[isYes.value ? 'yes' : 'think'])

// Be honest about what happened to her answer; say nothing while it is still being sent.
const noteKey = computed(() => ({
  sent: 'ending.noteSent',
  failed: 'ending.noteFailed',
  off: 'ending.noteLocal',
}[props.notifyStatus] ?? ''))

onMounted(() => {
  if (isYes.value && props.sound) chime()
})

const copied = ref(false)
let timer
async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1800)
  } catch {
    copied.value = false
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="story-screen ending-screen">
    <ConfettiBurst v-if="isYes" />
    <div class="ending-confetti" aria-hidden="true">
      <span v-for="n in 18" :key="n" :style="{ '--n': n }">{{ isYes ? '♥' : '✿' }}</span>
    </div>
    <div class="ending-icon" aria-hidden="true">{{ isYes ? '💗' : '🌷' }}</div>
    <div class="eyebrow">{{ copy.eyebrow }}</div>
    <h2>{{ copy.title }}</h2>
    <p class="ending-message">{{ copy.message }}</p>
    <div class="ending-divider" aria-hidden="true"><span>♥</span></div>
    <p class="ending-signature">{{ t('ending.signature') }}</p>
    <button class="primary-button" type="button" @click="$emit('restart')">
      {{ t('ending.again') }} <span class="button-arrow">↻</span>
    </button>
    <button class="share-button" type="button" @click="copyLink">
      {{ copied ? t('ending.copied') : t('ending.copy') }}
    </button>
    <p v-if="noteKey" class="tiny-note" role="status">{{ t(noteKey) }}</p>
  </section>
</template>
