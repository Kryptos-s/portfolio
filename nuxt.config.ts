// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/color-mode', 'nuxt-security'],

  css: ['~/assets/css/styles.css'],

  // Security: the strict, helmet-equivalent policy is applied in production (the
  // mode that actually gets deployed behind the Cloudflare Tunnel). In dev it is
  // relaxed so Vite/HMR keep working. COEP is left off to match the original,
  // which set no cross-origin-embedder policy.
  security: {
    headers: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    },
    rateLimiter: false,
    requestSizeLimiter: false
  },

  $production: {
    security: {
      nonce: true,
      headers: {
        contentSecurityPolicy: {
          'default-src': ["'self'"],
          // 'self' keeps parity with the old helmet config; the nonce lets Nuxt's
          // inline hydration + color-mode scripts run under a strict script-src.
          'script-src': ["'self'", "'nonce-{{nonce}}'"],
          // 'unsafe-inline' only for styles (Nuxt inlines critical CSS); styles can't execute JS.
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
          'connect-src': ["'self'"],
          'object-src': ["'none'"],
          'frame-ancestors': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"]
        },
        referrerPolicy: 'strict-origin-when-cross-origin'
      },
      // Every API route: 60 / 15 min. Contact form tightened to 5 / 15 min below.
      rateLimiter: { tokensPerInterval: 60, interval: 900000, headers: true },
      requestSizeLimiter: { maxRequestSizeInBytes: 20000, maxUploadFileRequestInBytes: 20000 }
    },
    routeRules: {
      '/api/contact': {
        security: { rateLimiter: { tokensPerInterval: 5, interval: 900000, headers: true } }
      }
    }
  },

  // Theme lives on <html data-theme="...">, set before paint (no flash).
  // Replaces the old public/js/theme-init.js.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    dataValue: 'theme',
    classSuffix: '',
    storageKey: 'theme'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'author', content: 'Kryptos' }
      ]
    }
  },

  runtimeConfig: {
    githubUsername: process.env.GITHUB_USERNAME || '',
    githubToken: process.env.GITHUB_TOKEN || '',
    databasePath: process.env.DATABASE_PATH || ''
  }
})
