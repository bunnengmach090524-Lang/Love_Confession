<script setup>
import { useI18n } from '../i18n'

defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
})
const { t } = useI18n()
</script>

<template>
  <div class="story-progress" role="img" :aria-label="t('ui.storyProgress', { current: current + 1, total })">
    <span v-for="n in total" :key="n" class="progress-dot" :class="{ active: n - 1 <= current }"></span>
  </div>
</template>
