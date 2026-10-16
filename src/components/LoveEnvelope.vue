<script setup>
import { useI18n } from '../i18n'

defineProps({
  opened: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
})
defineEmits(['open'])
const { t } = useI18n()
</script>

<template>
  <button
    class="envelope-button"
    :class="{ opened }"
    type="button"
    :aria-label="opened ? t('letter.envelopeOpened') : t('letter.envelopeClosed')"
    @click="$emit('open')"
  >
    <span class="envelope-shadow"></span>
    <span class="letter-paper">
      <span class="letter-lines"></span>
      <span class="letter-mini-heart">♥</span>
    </span>
    <span class="envelope-back"></span>
    <span class="envelope-front"></span>
    <span class="envelope-flap"></span>
    <span class="envelope-seal">♥</span>
    <span v-if="locked && !opened" class="envelope-lock" aria-hidden="true">🔒</span>
  </button>
</template>
