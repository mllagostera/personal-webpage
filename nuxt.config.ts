// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-02-23',
  srcDir: 'app',
  nitro: {
    preset: 'aws-amplify',
  },

  // app config
  app: {
    // global transition
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // modules
  modules: [
    // styling & ui
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    // management
    '@pinia/nuxt',
    '@vueuse/nuxt',
    // locale
    '@nuxtjs/i18n',
  ],

  css: [
    '~/assets/scss/_variables.scss',
    '~/assets/scss/app.scss',
  ],

  components: [
    '~/components',
  ],

  imports: {
    dirs: ['~/stores'],
  },

  // module::pinia
  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },

  // module::headlessui
  headlessui: {
    prefix: 'Headless',
  },

  // module::color-mode
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'nuxt-color-mode'
  },

  // localization
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.ts',
      },
      {
        code: 'es',
        name: 'Español',
        file: 'es-ES.ts',
      },
      {
        code: 'ca',
        name: 'Català',
        file: 'es-CA.ts',
      },
    ],
    defaultLocale: 'es',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
})
