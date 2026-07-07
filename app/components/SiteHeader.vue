<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Lab' }
]
</script>

<template>
  <header class="site-header">
    <div class="container">
      <NuxtLink to="/" class="logo" title="Home"><span class="logo-prompt">$</span> kryptos</NuxtLink>

      <nav class="main-nav" aria-label="Main">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          exact-active-class="active"
        >{{ link.label }}</NuxtLink>
      </nav>

      <div class="nav-actions">
        <a
          href="https://github.com/Kryptos-s"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-link"
          title="GitHub"
          aria-label="GitHub profile"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .3Z"/></svg>
        </a>
        <a
          href="mailto:kryptosss99@proton.me"
          class="icon-link"
          title="Email"
          aria-label="Send email"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>
        </a>
      </div>
    </div>
  </header>
</template>
