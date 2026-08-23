import { trimmedIconCollections } from './icon-collections.config'

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

  // module::icon — bundle everything locally so icon SVGs never require a
  // request to the public api.iconify.design at runtime. devicon /
  // devicon-plain / heroicons are used widely and bundled in full; the rest
  // are trimmed to the handful of icons this app actually uses (see
  // icon-collections.config.ts).
  icon: {
    serverBundle: {
      collections: ['devicon', 'devicon-plain', 'heroicons', ...trimmedIconCollections],
    },
  },

  app: {
    head: {
      htmlAttrs: {
        class: 'dark',
      },
      // Declared here rather than in app.vue so the error page gets them too:
      // app.vue does not render on an error, and a page that already lost its
      // way should not also lose its identity in the tab.
      //
      // Order is the negotiation: browsers take the last `icon` they can use,
      // so the .ico fallback comes first and the SVG — which stays sharp at any
      // size — wins wherever it is supported.
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
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
