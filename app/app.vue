<template>
  <NuxtLayout>
    <TheRouteLoader />
    <NuxtPage />
    <BackToTop />
  </NuxtLayout>
</template>

<script lang="ts" setup>
// Resolved (hashed) URLs of the font files above the fold, so the browser can
// start fetching them alongside the HTML instead of discovering them only
// after the CSS finishes downloading and parsing — on a throttled connection
// that late discovery is what gates LCP. Outfit 800 sets the hero name, the
// LCP element; Plus Jakarta Sans 400 the first paragraph of prose.
import outfitFontUrl from '@fontsource/outfit/files/outfit-latin-800-normal.woff2?url'
import plusJakartaSansFontUrl from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2?url'

const { locale } = useI18n()
const { gscToken } = useRuntimeConfig().public

// Site-wide head. Per-route title/description/canonical live in `useSiteSeo`.
useHead({
  htmlAttrs: {
    lang: locale,
  },
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: outfitFontUrl, crossorigin: 'anonymous' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: plusJakartaSansFontUrl, crossorigin: 'anonymous' },
  ],
  meta: [
    { name: 'theme-color', content: '#030712' },
    // Only rendered when the token is configured — never an empty meta tag.
    ...(gscToken ? [{ name: 'google-site-verification', content: gscToken }] : []),
  ],
})
</script>
