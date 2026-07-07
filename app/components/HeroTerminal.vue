<script setup lang="ts">
const prompt = ref('')
const name = ref('')
const tagline = ref('')
const taglineDone = ref(false)
const ready = ref(false)

// Same sequence/timings as the old startHeroAnimation() in main.js.
onMounted(async () => {
  const { wait, type } = useTypewriter()

  await wait(500)
  await wait(1000)
  await type(prompt, '$ whoami', 75)

  await wait(300)
  await type(name, 'KRYPTOS', 120)

  await type(tagline, '// cyber sec // reverse engineer // C-family dev', 50)
  taglineDone.value = true
  ready.value = true
})
</script>

<template>
  <section id="hero-section" class="hero terminal-box">
    <p id="hero-prompt" class="prompt-line">{{ prompt }}</p>
    <h1 id="hero-name" class="hero-name">{{ name }}</h1>
    <p id="hero-tagline" class="hero-tagline" :class="{ 'with-cursor': taglineDone }">{{ tagline }}</p>

    <div id="hero-actions" class="hero-actions" :class="{ 'hidden-until-ready': !ready }">
      <NuxtLink to="/projects" class="button primary animate-glitch" title="View Portfolio Projects">View Projects</NuxtLink>
      <NuxtLink to="/contact" class="button secondary" title="Send a message">Contact Me</NuxtLink>
    </div>
  </section>
</template>
