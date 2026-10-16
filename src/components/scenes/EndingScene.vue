<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from '../../i18n'
import { sendMessage } from '../../composables/useNotify'

const props = defineProps({ answer: { type: String, default: 'think' } })
defineEmits(['restart'])
const { t, messages, locale } = useI18n()

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

// Optional written reply (only offered when she chose "Can I think about it?").
const draft = ref('')
const state = ref('idle') // idle | sending | sent | failed
async function submitMessage() {
  const text = draft.value.trim()
  if (!text || state.value === 'sending' || state.value === 'sent') return
  state.value = 'sending'
  state.value = (await sendMessage(text, locale.value)) ? 'sent' : 'failed'
}
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

    <form v-if="!isYes" class="note-box" @submit.prevent="submitMessage">
      <label class="note-label" for="her-note">{{ t('ending.messagePrompt') }}</label>
      <textarea
        id="her-note"
        v-model="draft"
        rows="4"
        maxlength="800"
        :placeholder="t('ending.messagePlaceholder')"
        :disabled="state === 'sent'"
      ></textarea>
      <p class="note-notice">{{ t('ending.messageNotice') }}</p>
      <button class="primary-button" type="submit" :disabled="!draft.trim() || state === 'sending' || state === 'sent'">
        {{ state === 'sending' ? '…' : t('ending.messageSend') }}
      </button>
      <p v-if="state === 'sent'" class="note-status ok" role="status">{{ t('ending.messageSent') }}</p>
      <p v-else-if="state === 'failed'" class="note-status err" role="alert">{{ t('ending.messageFail') }}</p>
    </form>

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
