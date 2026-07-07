<template>
  <!-- 1px sentinel: kept for the header's scroll observer -->
  <span id="top-sentinel" aria-hidden="true" style="position: absolute; top: 0; height: 1px; width: 1px;" />
  <SiteHeader />
  <main class="page">
    <slot />
  </main>
  <SiteFooter />
  <div class="scanlines" aria-hidden="true" />
  <div class="grain" aria-hidden="true" />
</template>
