<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from '../../i18n'

const props = defineProps({ answer: { type: String, default: 'think' } })
defineEmits(['restart'])
const { t, messages } = useI18n()

const isYes = computed(() => props.answer === 'yes')
const copy = computed(() => messages.value.ending[isYes.value ? 'yes' : 'think'])

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
    <p class="tiny-note">{{ t('ending.note') }}</p>
  </section>
</template>
