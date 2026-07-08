<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <div class="top-glow" aria-hidden="true" />
  <SiteHeader />
  <main id="main" class="page" tabindex="-1">
    <slot />
  </main>
  <SiteFooter />
  <div class="scanlines" aria-hidden="true" />
  <div class="grain" aria-hidden="true" />
</template>
