<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n'

const emit = defineEmits(['back', 'next'])
const { t, messages } = useI18n()

const index = ref(0)
const items = computed(() => messages.value.reasons.items)
const reason = computed(() => items.value[index.value])
const isLast = computed(() => index.value >= items.value.length - 1)

function advance() {
  if (isLast.value) emit('next')
  else index.value += 1
}
</script>

<template>
  <section class="story-screen reasons-screen">
    <div class="eyebrow">{{ t('reasons.eyebrow') }}</div>
    <h2>{{ t('reasons.titleA') }} <em>{{ t('reasons.titleEm') }}</em></h2>
    <p class="sublead">{{ t('reasons.sublead') }}</p>
    <div class="reason-counter">0{{ index + 1 }} <span>/ 0{{ items.length }}</span></div>
    <Transition name="reason" mode="out-in">
      <article class="reason-card" :key="index">
        <div class="reason-icon">{{ reason.icon }}</div>
        <div class="reason-line"></div>
        <h3>{{ reason.title }}</h3>
        <p>{{ reason.text }}</p>
        <div class="card-flower" aria-hidden="true">✿</div>
      </article>
    </Transition>
    <div class="mini-dots" aria-hidden="true">
      <span v-for="(_, i) in items" :key="i" :class="{ active: i === index }"></span>
    </div>
    <div class="button-row">
      <button class="text-button" type="button" @click="$emit('back')">{{ t('ui.back') }}</button>
      <button class="primary-button" type="button" @click="advance">
        {{ isLast ? t('reasons.last') : t('reasons.more') }} <span class="button-arrow">→</span>
      </button>
    </div>
  </section>
</template>
