<script setup lang="ts">
const links = [
  { to: '/', label: 'Index' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Lab' }
]

// Live UTC readout. Rendered post-mount only, so SSR and client never differ.
const utc = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  const d = new Date()
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  utc.value = `${hh}:${mm}:${ss} UTC`
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <header class="site-header">
    <div class="container">
      <NuxtLink to="/" class="logo" title="Index">Kryptos<sup>v2</sup></NuxtLink>

      <nav class="main-nav" aria-label="Main">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          exact-active-class="active"
        >{{ link.label }}</NuxtLink>
      </nav>

      <div class="nav-status">
        <span v-if="utc" class="sys">{{ utc }}</span>
        <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </header>
</template>
