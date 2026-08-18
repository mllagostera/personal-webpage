
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

  // Permanent redirects for the section ids that used to be anchors, in case
  // anyone linked them as paths. The `#anchor` form cannot be redirected here:
  // a fragment never reaches the server (see app/plugins/legacy-hash.client.ts).
  routeRules: {
    '/about': { redirect: { to: '/', statusCode: 301 } },
    '/technologies': { redirect: { to: '/', statusCode: 301 } },
    '/softskills': { redirect: { to: '/', statusCode: 301 } },
    '/workExperience': { redirect: { to: '/experience', statusCode: 301 } },
    '/education': { redirect: { to: '/experience', statusCode: 301 } },
    '/github-collaborations': { redirect: { to: '/projects', statusCode: 301 } },
  },

  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    public: {
      // Google Search Console ownership token. Overridable at runtime with
      // NUXT_PUBLIC_GSC_TOKEN; when empty the meta tag is not rendered at all.
      gscToken: process.env.NUXT_PUBLIC_GSC_TOKEN || process.env.GG_SEARCH_CONSOLE || '',
    },
  },

  // modules
  modules: [
    // styling & ui
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    // management
    '@vueuse/nuxt',
    // locale
    '@nuxtjs/i18n',
    // linting
    '@nuxt/eslint',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/scss/_variables.scss',
    '~/assets/scss/app.scss',
  ],

  components: [
    '~/components',
  ],

  // module::headlessui
  headlessui: {
    prefix: 'Headless',
  },

  app: {
    head: {
      htmlAttrs: {
        class: 'dark',
      },
    },
  },

  // module::color-mode
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
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
