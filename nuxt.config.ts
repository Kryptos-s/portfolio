// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['nuxt-security'],

  css: [
    '@fontsource-variable/geist',
    '@fontsource-variable/geist-mono',
    '~/assets/css/styles.css'
  ],

  // Old slugs from the 7-page layout; keep links alive.
  routeRules: {
    '/contact': { redirect: { to: '/about', statusCode: 301 } },
    '/gallery': { redirect: { to: '/lab', statusCode: 301 } },
    '/uses': { redirect: { to: '/about', statusCode: 301 } }
  },

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
          // inline hydration script run under a strict script-src.
          'script-src': ["'self'", "'nonce-{{nonce}}'"],
          // 'unsafe-inline' only for styles (Nuxt inlines critical CSS); styles can't execute JS.
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'"],
          'connect-src': ["'self'"],
          'object-src': ["'none'"],
          'frame-ancestors': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"]
        },
        referrerPolicy: 'strict-origin-when-cross-origin'
      },
      // Every API route: 60 / 15 min.
      rateLimiter: { tokensPerInterval: 60, interval: 900000, headers: true },
      requestSizeLimiter: { maxRequestSizeInBytes: 20000, maxUploadFileRequestInBytes: 20000 }
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
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
