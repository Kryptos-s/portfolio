<script setup lang="ts">
const themes = ['dark', 'light', 'purple'] as const

const colorMode = useColorMode()

// Render the letter only after mount so SSR (which defaults to 'dark') and the
// client (which may restore a different stored theme) don't mismatch.
const mounted = ref(false)
onMounted(() => { mounted.value = true })

const label = computed(() =>
  mounted.value ? (colorMode.preference || 'dark').charAt(0).toUpperCase() : ''
)

function cycle() {
  const current = colorMode.preference as typeof themes[number]
  const next = themes[(themes.indexOf(current) + 1) % themes.length]
  colorMode.preference = next
}
</script>

<template>
  <button
    id="theme-switcher"
    aria-label="Theme Switcher"
    :title="`Current Theme: ${colorMode.preference}. Click to switch.`"
    @click="cycle"
  >{{ label }}</button>
</template>
