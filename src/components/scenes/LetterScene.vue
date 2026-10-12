<script setup>
import { nextTick, ref } from 'vue'
import LoveEnvelope from '../LoveEnvelope.vue'
import { CONFIG } from '../../config'
import { useI18n } from '../../i18n'

const props = defineProps({
  opened: { type: Boolean, default: false },
  unlocked: { type: Boolean, default: true },
})
const emit = defineEmits(['open', 'unlock', 'back', 'next'])
const { t, messages } = useI18n()

const gateOpen = ref(false)
const code = ref('')
const wrongTries = ref(0)
const showError = ref(false)
const codeInput = ref(null)

// Tapping a locked envelope asks for the passcode first; an unlocked one just opens.
async function onEnvelope() {
  if (props.unlocked) {
    emit('open')
    return
  }
  gateOpen.value = true
  await nextTick()
  codeInput.value?.focus()
}

function submitCode() {
  const entered = code.value.replace(/\D/g, '')
  if (entered === CONFIG.passcode) {
    showError.value = false
    gateOpen.value = false
    emit('unlock')
    emit('open')
    return
  }
  wrongTries.value += 1
  showError.value = true
  code.value = ''
  codeInput.value?.focus()
}
</script>

<template>
  <section class="story-screen letter-screen">
    <div class="eyebrow">{{ t('letter.eyebrow') }}</div>
    <h2>{{ t('letter.titleA') }} <em>{{ t('letter.titleEm') }}</em></h2>
    <p class="sublead">{{ t('letter.sublead') }}</p>
    <div class="envelope-stage">
      <LoveEnvelope :opened="opened" @open="onEnvelope" />
      <span class="envelope-spark spark-a" aria-hidden="true">✧</span>
      <span class="envelope-spark spark-b" aria-hidden="true">✦</span>
    </div>
    <Transition name="letter-reveal">
      <form v-if="gateOpen && !unlocked" class="passcode-gate" @submit.prevent="submitCode">
        <label class="passcode-label" for="passcode">{{ t('letter.gatePrompt') }}</label>
        <div class="passcode-row">
          <input
            id="passcode"
            ref="codeInput"
            v-model="code"
            class="passcode-input"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="off"
            placeholder="••••"
            :maxlength="CONFIG.passcode.length"
            :aria-invalid="showError"
            aria-describedby="passcode-message"
          />
          <button class="primary-button passcode-button" type="submit">{{ t('letter.gateButton') }}</button>
        </div>
        <p id="passcode-message" class="passcode-message" role="status">
          <span v-if="showError">{{ t('letter.gateWrong') }}</span>
          <span v-if="wrongTries >= 2"> {{ t('letter.gateHint') }}</span>
        </p>
      </form>
    </Transition>
    <Transition name="letter-reveal">
      <div v-if="opened" class="revealed-note">
        <span class="note-heart">♥</span>
        <p>{{ t('letter.hi', { name: messages.recipient }) }}</p>
        <p>{{ t('letter.body') }}</p>
        <span class="note-signature">{{ t('letter.signature') }}</span>
      </div>
    </Transition>
    <div class="button-row">
      <button class="text-button" type="button" @click="$emit('back')">{{ t('ui.back') }}</button>
      <button class="primary-button" type="button" @click="$emit('next')">
        {{ opened ? t('letter.next') : t('letter.continue') }} <span class="button-arrow">→</span>
      </button>
    </div>
  </section>
</template>
