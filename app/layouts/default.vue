<template>
  <SiteHeader />
  <div class="site-wrapper">
    <MainNav />
    <main class="main-content">
      <slot />
    </main>
    <SiteSidebar />
  </div>
  <SiteFooter />
</template>
