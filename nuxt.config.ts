// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/color-mode'],

  css: ['~/assets/css/styles.css'],

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
