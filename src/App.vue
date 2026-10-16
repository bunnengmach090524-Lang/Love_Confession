<script setup>
import AnimatedBackground from './components/AnimatedBackground.vue'
import LanguageToggle from './components/LanguageToggle.vue'
import StoryProgress from './components/StoryProgress.vue'
import ToastMessage from './components/ToastMessage.vue'
import WelcomeScene from './components/scenes/WelcomeScene.vue'
import LetterScene from './components/scenes/LetterScene.vue'
import ReasonsScene from './components/scenes/ReasonsScene.vue'
import ConfessionScene from './components/scenes/ConfessionScene.vue'
import QuestionScene from './components/scenes/QuestionScene.vue'
import EndingScene from './components/scenes/EndingScene.vue'
import { useI18n } from './i18n'
import { sendAnswer } from './composables/useNotify'
import { useMusic } from './composables/useMusic'
import { useStory } from './composables/useStory'
import { useToast } from './composables/useToast'

const { t, locale } = useI18n()
const { showToast } = useToast()
const story = useStory()
const music = useMusic({ onError: () => showToast(t('ui.musicUnavailable')) })

function onChoose(answer) {
  story.choose(answer)
  sendAnswer(answer, locale.value) // she was told about this on the question screen
}
</script>

<template>
  <main class="app-shell">
    <AnimatedBackground />

    <header class="topbar">
      <a class="brand" href="#" :aria-label="t('ui.restartLabel')" @click.prevent="story.restart()">
        <span class="brand-heart">♥</span>
        <span class="brand-text">{{ t('ui.brand') }}</span>
      </a>
      <div class="topbar-actions">
        <LanguageToggle />
        <button class="music-toggle" type="button" :aria-pressed="music.playing.value" @click="music.toggle">
          <span class="music-icon">{{ music.playing.value ? '♫' : '♪' }}</span>
          <span class="music-label">{{ music.playing.value ? t('ui.musicOn') : t('ui.musicOff') }}</span>
        </button>
      </div>
    </header>

    <StoryProgress :current="story.sceneIndex.value" :total="story.total" />

    <Transition name="scene" mode="out-in">
      <WelcomeScene v-if="story.scene.value === 'welcome'" key="welcome" @next="story.next()" />
      <LetterScene
        v-else-if="story.scene.value === 'letter'"
        key="letter"
        :opened="story.letterOpened.value"
        :unlocked="story.unlocked.value"
        @open="story.openLetter()"
        @back="story.back()"
        @next="story.next()"
      />
      <ReasonsScene v-else-if="story.scene.value === 'reasons'" key="reasons" @back="story.back()" @next="story.next()" />
      <ConfessionScene v-else-if="story.scene.value === 'confession'" key="confession" @back="story.back()" @next="story.next()" />
      <QuestionScene v-else-if="story.scene.value === 'question'" key="question" @choose="onChoose" @back="story.back()" />
      <EndingScene v-else key="ending" :answer="story.answer.value" @restart="story.restart()" />
    </Transition>

    <footer class="footer">
      <span>{{ t('ui.footerA') }} <span class="footer-heart">♥</span> {{ t('ui.footerB') }}</span>
      <span class="footer-separator">·</span>
      <span>{{ t('ui.footerC') }}</span>
    </footer>

    <ToastMessage />
  </main>
</template>
