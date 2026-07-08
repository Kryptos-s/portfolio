// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['nuxt-security'],

  // Fonts are self-hosted from public/fonts (latin + latin-ext woff2 subsets,
  // declared in styles.css) so the two critical files can be preloaded.
  css: ['~/assets/css/styles.css'],

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
      // No CORS headers at all: the API is same-origin only, and the default
      // handler would otherwise emit Access-Control-Allow-Origin: *.
      corsHandler: false,
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
        // Match the CSP's frame-ancestors 'none'.
        xFrameOptions: 'DENY',
        referrerPolicy: 'strict-origin-when-cross-origin'
      },
      // Page routes stay unmetered; API routes get the 60 / 15 min budget via
      // the routeRules override below.
      rateLimiter: false,
      requestSizeLimiter: { maxRequestSizeInBytes: 20000, maxUploadFileRequestInBytes: 20000 }
    },
    routeRules: {
      '/api/**': {
        security: {
          rateLimiter: { tokensPerInterval: 60, interval: 900000, headers: true }
        }
      }
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'author', content: 'Kryptos' },
        { name: 'theme-color', content: '#0a0a0a' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // The three critical latin subsets; latin-ext loads on demand via unicode-range.
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/fonts/archivo-black-latin-400-normal.woff2' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/fonts/geist-latin-wght-normal.woff2' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/fonts/jetbrains-mono-latin-wght-normal.woff2' }
      ]
    }
  },

  runtimeConfig: {
    githubUsername: process.env.GITHUB_USERNAME || '',
    githubToken: process.env.GITHUB_TOKEN || '',
    databasePath: process.env.DATABASE_PATH || ''
  }
})
