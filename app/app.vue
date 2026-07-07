<script setup lang="ts">
const SITE = 'https://lab.kryptosss.xyz'
const route = useRoute()

// Site-wide head: canonical per route, share-card defaults (pages set their own
// ogTitle/ogDescription), Person JSON-LD, and a no-JS fallback that undoes the
// scroll-reveal opacity so content is never invisible without scripts.
useHead({
  link: [{ rel: 'canonical', href: () => SITE + route.path }],
  noscript: [{ innerHTML: '<style>.section-fade-in{opacity:1!important}.cascade>*{opacity:1!important}</style>' }],
  script: [
    {
      type: 'application/ld+json',
      // JSON-LD is inert data (never executed), so the strict CSP is unaffected.
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Kryptos',
        url: SITE,
        description: 'Cybersecurity student and reverse engineer.',
        sameAs: [
          'https://github.com/Kryptos-s',
          'https://crackmes.one/user/Kryptos'
        ]
      })
    }
  ]
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Kryptos',
  ogUrl: () => SITE + route.path,
  ogImage: `${SITE}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Kryptos: cybersecurity and reverse engineering',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
