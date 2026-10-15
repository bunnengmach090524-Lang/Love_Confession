<script setup>
import { useI18n } from '../../i18n'

defineEmits(['next'])
const { t, messages } = useI18n()
</script>

<template>
  <section class="story-screen welcome-screen">
    <div class="eyebrow"><span class="tiny-sparkle">✦</span> {{ t('welcome.eyebrow') }}</div>
    <div class="hero-heart-wrap" aria-hidden="true">
      <div class="hero-orbit orbit-one"></div>
      <div class="hero-orbit orbit-two"></div>
      <div class="hero-heart">♥</div>
      <span class="orbit-spark s-one">✦</span>
      <span class="orbit-spark s-two">✧</span>
      <span class="orbit-spark s-three">♡</span>
    </div>
    <h1>{{ t('welcome.hey') }} <span class="script-word">{{ messages.recipient }}<span class="pink-period">…</span></span></h1>
    <p class="lead">{{ t('welcome.lead1') }}<br />{{ t('welcome.lead2') }}</p>
    <button class="primary-button" type="button" @click="$emit('next')">
      {{ t('welcome.button') }} <span class="button-arrow">↗</span>
    </button>
    <p class="tiny-note">{{ t('welcome.note') }}</p>
    <div class="bottom-decoration">✿ &nbsp; {{ t('welcome.decoration') }} &nbsp; ✿</div>
  </section>
</template>
