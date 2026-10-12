<script setup>
import { useI18n } from '../i18n'

const { locale, setLocale, t } = useI18n()
const options = [
  { code: 'en', label: 'EN' },
  { code: 'km', label: 'ខ្មែរ' },
]
</script>

<template>
  <div class="lang-toggle" role="group" :aria-label="t('ui.langLabel')">
    <button
      v-for="option in options"
      :key="option.code"
      type="button"
      class="lang-option"
      :class="{ active: locale === option.code }"
      :lang="option.code"
      :aria-pressed="locale === option.code"
      @click="setLocale(option.code)"
    >{{ option.label }}</button>
  </div>
</template>
