<script setup>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from '../../i18n'
import { useTypewriter } from '../../composables/useTypewriter'

defineEmits(['back', 'next'])
const { t, messages } = useI18n()

const text = computed(() => messages.value.confession.text)
const { typed, done, start } = useTypewriter(text, 30)

onMounted(start)
watch(text, start) // switching language mid-way restarts the typing in the new language
</script>

<template>
  <section class="story-screen confession-screen">
    <div class="eyebrow">{{ t('confession.eyebrow') }}</div>
    <div class="confession-ornament" aria-hidden="true">♡</div>
    <h2>{{ t('confession.titleA') }} <em>{{ t('confession.titleEm') }}</em></h2>
    <div class="confession-paper">
      <span class="paper-flower" aria-hidden="true">✿</span>
      <!-- Screen readers get the full text at once; the typing effect is visual only. -->
      <p class="sr-only">{{ text }}</p>
      <p class="typed-message" aria-hidden="true">{{ typed }}<span v-if="!done" class="typing-cursor">|</span></p>
      <div v-if="done" class="paper-signoff">{{ t('confession.signoff') }}</div>
    </div>
    <p class="gentle-note">{{ t('confession.gentle') }}</p>
    <div class="button-row">
      <button class="text-button" type="button" @click="$emit('back')">{{ t('ui.back') }}</button>
      <button class="primary-button" type="button" @click="$emit('next')">
        {{ t('confession.next') }} <span class="button-arrow">→</span>
      </button>
    </div>
  </section>
</template>
