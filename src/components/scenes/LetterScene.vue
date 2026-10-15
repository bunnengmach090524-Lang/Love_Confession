<script setup>
import LoveEnvelope from '../LoveEnvelope.vue'
import { useI18n } from '../../i18n'

defineProps({ opened: { type: Boolean, default: false } })
defineEmits(['open', 'back', 'next'])
const { t, messages } = useI18n()
</script>

<template>
  <section class="story-screen letter-screen">
    <div class="eyebrow">{{ t('letter.eyebrow') }}</div>
    <h2>{{ t('letter.titleA') }} <em>{{ t('letter.titleEm') }}</em></h2>
    <p class="sublead">{{ t('letter.sublead') }}</p>
    <div class="envelope-stage">
      <LoveEnvelope :opened="opened" @open="$emit('open')" />
      <span class="envelope-spark spark-a" aria-hidden="true">✧</span>
      <span class="envelope-spark spark-b" aria-hidden="true">✦</span>
    </div>
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
