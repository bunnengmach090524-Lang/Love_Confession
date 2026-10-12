<script setup>
import { useToast } from '../composables/useToast'

const { message } = useToast()
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="toast" role="status" aria-live="polite">{{ message }}</div>
  </Transition>
</template>
