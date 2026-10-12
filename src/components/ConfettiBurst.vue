<script setup>
// One-time burst of confetti and hearts from the middle of the screen.
// Pieces are generated once on mount; the CSS animation fades them out. Hidden by "reduce motion".
const COLORS = ['#e8709f', '#f5a3c2', '#ffd1e1', '#f7c873', '#c9a7f0', '#ffffff', '#d4568a']

const pieces = Array.from({ length: 56 }, (_, i) => {
  const angle = Math.random() * Math.PI * 2
  const force = 90 + Math.random() * 190
  return {
    id: i,
    heart: i % 3 === 0,
    style: {
      '--x': `${Math.cos(angle) * force}px`,
      '--y': `${Math.sin(angle) * force * 0.75 - 70}px`,
      '--r': `${Math.round((Math.random() - 0.5) * 900)}deg`,
      '--d': `${(Math.random() * 0.25).toFixed(2)}s`,
      '--t': `${(2.6 + Math.random() * 1.6).toFixed(2)}s`,
      '--s': `${6 + Math.round(Math.random() * 6)}px`,
      '--s2': `${14 + Math.round(Math.random() * 14)}px`,
      '--c': COLORS[i % COLORS.length],
    },
  }
})
</script>

<template>
  <div class="confetti-burst" aria-hidden="true">
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="confetti-piece"
      :class="{ heart: piece.heart }"
      :style="piece.style"
    >{{ piece.heart ? '♥' : '' }}</span>
  </div>
</template>
