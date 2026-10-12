<script setup>
import { computed, reactive, ref } from 'vue'
import { CONFIG } from '../../config'
import { useI18n } from '../../i18n'

const emit = defineEmits(['back', 'next'])
const { t, messages } = useI18n()

const base = import.meta.env.BASE_URL
const photos = CONFIG.photos.map((name) => `${base}photos/${name}`)

const index = ref(0)
const broken = reactive({}) // a photo that fails to load shows a heart instead of a broken icon
const isLast = computed(() => index.value >= photos.length - 1)
const caption = computed(() => messages.value.gallery.captions[index.value] ?? '')

function advance() {
  if (isLast.value) emit('next')
  else index.value += 1
}
</script>

<template>
  <section class="story-screen gallery-screen">
    <div class="eyebrow">{{ t('gallery.eyebrow') }}</div>
    <h2>{{ t('gallery.titleA') }} <em>{{ t('gallery.titleEm') }}</em></h2>
    <p class="sublead">{{ t('gallery.sublead') }}</p>
    <Transition name="reason" mode="out-in">
      <figure class="gallery-card" :key="index" :class="{ tilt: index % 2 === 1 }">
        <div v-if="broken[index]" class="gallery-photo gallery-placeholder" aria-hidden="true">♥</div>
        <img
          v-else
          class="gallery-photo"
          :src="photos[index]"
          :alt="t('gallery.photoAlt', { n: index + 1 })"
          loading="lazy"
          @error="broken[index] = true"
        />
        <figcaption v-if="caption" class="gallery-caption">{{ caption }}</figcaption>
      </figure>
    </Transition>
    <div v-if="photos.length > 1" class="mini-dots" aria-hidden="true">
      <span v-for="(_, i) in photos" :key="i" :class="{ active: i === index }"></span>
    </div>
    <div class="button-row">
      <button class="text-button" type="button" @click="$emit('back')">{{ t('ui.back') }}</button>
      <button class="primary-button" type="button" @click="advance">
        {{ isLast ? t('gallery.last') : t('gallery.more') }} <span class="button-arrow">→</span>
      </button>
    </div>
  </section>
</template>
