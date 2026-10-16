<script setup>
import { computed, nextTick, ref } from 'vue'
import LoveEnvelope from '../LoveEnvelope.vue'
import { useI18n } from '../../i18n'
import { checkPassword } from '../../composables/useUnlock'

const props = defineProps({
  opened: { type: Boolean, default: false },
  unlocked: { type: Boolean, default: false },
})
const emit = defineEmits(['open', 'back', 'next'])
const { t, messages } = useI18n()

const showLock = ref(false)
const password = ref('')
const reveal = ref(false)
const busy = ref(false)
const status = ref('') // '' | 'wrong' | 'error'
const shake = ref(false)
const input = ref(null)

const message = computed(() => (status.value === 'wrong' ? t('letter.lockWrong') : status.value === 'error' ? t('letter.lockError') : ''))
const hint = computed(() => messages.value.letter.hint)

async function onEnvelope() {
  if (props.opened) return
  if (props.unlocked) return emit('open')
  showLock.value = true
  await nextTick()
  input.value?.focus()
}

async function submit() {
  if (busy.value || !password.value.trim()) return
  busy.value = true
  status.value = ''
  const result = await checkPassword(password.value)
  busy.value = false
  if (result === 'ok') {
    showLock.value = false
    password.value = ''
    return emit('open')
  }
  status.value = result
  shake.value = true
  setTimeout(() => { shake.value = false }, 500)
  input.value?.select()
}
</script>

<template>
  <section class="story-screen letter-screen">
    <div class="eyebrow">{{ t('letter.eyebrow') }}</div>
    <h2>{{ t('letter.titleA') }} <em>{{ t('letter.titleEm') }}</em></h2>
    <p class="sublead">{{ t('letter.sublead') }}</p>
    <div class="envelope-stage">
      <LoveEnvelope :opened="opened" :locked="!unlocked" @open="onEnvelope" />
      <span class="envelope-spark spark-a" aria-hidden="true">✧</span>
      <span class="envelope-spark spark-b" aria-hidden="true">✦</span>
    </div>

    <Transition name="lock">
      <form v-if="showLock && !unlocked && !opened" class="lock-panel" :class="{ shake }" novalidate @submit.prevent="submit">
        <div class="lock-title"><span aria-hidden="true">🔒</span> {{ t('letter.lockTitle') }}</div>
        <p v-if="hint" class="lock-hint">{{ t('letter.hintLabel') }} {{ hint }}</p>
        <div class="lock-field">
          <input
            ref="input"
            v-model="password"
            :type="reveal ? 'text' : 'password'"
            :placeholder="t('letter.lockPlaceholder')"
            :aria-label="t('letter.lockPlaceholder')"
            :aria-invalid="status === 'wrong'"
            maxlength="100"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            enterkeyhint="go"
          />
          <button type="button" class="lock-eye" :aria-label="reveal ? t('letter.hide') : t('letter.show')" @click="reveal = !reveal">
            {{ reveal ? '🙈' : '👁' }}
          </button>
        </div>
        <p class="lock-msg" role="status">{{ message }}</p>
        <button class="primary-button" type="submit" :disabled="busy || !password.trim()">
          {{ busy ? '…' : t('letter.lockButton') }}
        </button>
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
      <!-- Only after the letter is open, so the lock can't be skipped. -->
      <button v-if="opened" class="primary-button" type="button" @click="$emit('next')">
        {{ t('letter.next') }} <span class="button-arrow">→</span>
      </button>
    </div>
  </section>
</template>
