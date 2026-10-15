<script setup>
import { useI18n } from '../../i18n'

defineEmits(['choose', 'back'])
const { t } = useI18n()
</script>

<template>
  <section class="story-screen question-screen">
    <div class="question-stars" aria-hidden="true">✦　·　✧　·　✦</div>
    <div class="big-glowing-heart" aria-hidden="true"><span>♥</span></div>
    <div class="eyebrow">{{ t('question.eyebrow') }}</div>
    <h2>{{ t('question.title') }}</h2>
    <p class="sublead">{{ t('question.sublead') }}</p>
    <div class="answer-buttons">
      <button class="answer-yes" type="button" @click="$emit('choose', 'yes')">
        {{ t('question.yes') }} <span>💗</span>
      </button>
      <button class="answer-think" type="button" @click="$emit('choose', 'think')">
        {{ t('question.think') }} <span>🌷</span>
      </button>
    </div>
    <button class="text-button question-back" type="button" @click="$emit('back')">{{ t('question.readAgain') }}</button>
    <p class="tiny-note">{{ t('question.note') }}<br />{{ t('question.notify') }}</p>
  </section>
</template>
