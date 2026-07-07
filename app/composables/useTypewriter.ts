import type { Ref } from 'vue'

// Tiny typewriter helper: appends `text` into a string ref one char at a time.
// Mirrors the old main.js typeLine()/wait() pair.
export function useTypewriter() {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  async function type(target: Ref<string>, text: string, speed = 100) {
    for (const char of text) {
      target.value += char
      await wait(speed)
    }
  }

  return { wait, type }
}
