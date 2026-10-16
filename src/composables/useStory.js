import { computed, ref } from 'vue'

export const SCENES = ['welcome', 'letter', 'reasons', 'confession', 'question', 'ending']

/** Story navigation + the few pieces of state that must survive between scenes. */
export function useStory() {
  const sceneIndex = ref(0)
  const letterOpened = ref(false)
  const unlocked = ref(false) // stays true after the right secret word, even if she restarts
  const answer = ref('') // '' | 'yes' | 'think'

  const scene = computed(() => SCENES[sceneIndex.value])

  function goTo(index) {
    sceneIndex.value = Math.max(0, Math.min(SCENES.length - 1, index))
  }
  const next = () => goTo(sceneIndex.value + 1)
  const back = () => goTo(sceneIndex.value - 1)

  function openLetter() {
    unlocked.value = true
    letterOpened.value = true
  }

  function choose(value) {
    answer.value = value
    goTo(SCENES.indexOf('ending'))
  }

  function restart() {
    answer.value = ''
    letterOpened.value = false
    goTo(0)
  }

  return { sceneIndex, scene, total: SCENES.length, letterOpened, unlocked, answer, goTo, next, back, openLetter, choose, restart }
}
