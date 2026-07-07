<template>
  <ClientOnly>
    <ParticleBackground />
  </ClientOnly>
  <SiteHeader />
  <main class="page">
    <div class="container">
      <slot />
    </div>
  </main>
  <SiteFooter />
</template>
