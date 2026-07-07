<template>
  <ClientOnly>
    <ParticleBackground />
  </ClientOnly>
  <!-- 1px sentinel: SiteHeader observes it to engage the scrolled state -->
  <span id="top-sentinel" aria-hidden="true" style="position: absolute; top: 0; height: 1px; width: 1px;" />
  <SiteHeader />
  <main class="page">
    <div class="container">
      <slot />
    </div>
  </main>
  <SiteFooter />
  <div class="grain" aria-hidden="true" />
</template>
