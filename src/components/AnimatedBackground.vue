<script setup>
import { computed } from 'vue'

const hearts = Array.from({ length: 17 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 7) % 100}%`,
  delay: `${(i % 8) * -1.7}s`,
  duration: `${12 + (i % 7) * 2}s`,
  size: `${12 + (i % 5) * 5}px`,
  drift: `${((i % 5) - 2) * 28}px`,
  opacity: 0.18 + (i % 5) * 0.055,
}))
const sparkles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 53 + 13) % 100}%`,
  top: `${(i * 29 + 5) % 100}%`,
  delay: `${(i % 9) * -0.8}s`,
  size: `${3 + (i % 4)}px`,
}))
</script>

<template>
  <div class="animated-bg" aria-hidden="true">
    <div class="aurora aurora-one"></div>
    <div class="aurora aurora-two"></div>
    <div class="aurora aurora-three"></div>
    <div class="moon-glow"></div>
    <span
      v-for="heart in hearts"
      :key="heart.id"
      class="float-heart"
      :style="{
        left: heart.left,
        animationDelay: heart.delay,
        animationDuration: heart.duration,
        fontSize: heart.size,
        '--drift': heart.drift,
        opacity: heart.opacity
      }"
    >{{ heart.id % 4 === 0 ? '♡' : '♥' }}</span>
    <span
      v-for="sparkle in sparkles"
      :key="sparkle.id"
      class="sparkle"
      :style="{
        left: sparkle.left,
        top: sparkle.top,
        animationDelay: sparkle.delay,
        width: sparkle.size,
        height: sparkle.size
      }"
    ></span>
    <div class="petal-field">
      <span v-for="n in 9" :key="n" class="petal" :style="{ '--n': n }"></span>
    </div>
  </div>
</template>
