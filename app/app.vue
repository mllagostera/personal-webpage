<template>
  <NuxtLayout>
    <TheRouteLoader />
    <NuxtPage />
    <BackToTop />

    <!-- Global Contact Modal. Lazy so its chunk (headlessui + form) and CSS
         don't block the initial render of every page — it only loads once
         the user actually opens it. -->
    <LazyContactModal
      :is-open="isContactModalOpen"
      @close="closeContactModal"
      @closed="restoreContactModalFocus"
    >
      <LazyContactFormContent />
    </LazyContactModal>
  </NuxtLayout>
</template>

<script lang="ts" setup>
// Resolved (hashed) URLs of the default-weight font files, so the browser
// can start fetching them alongside the HTML instead of discovering them
// only after the CSS finishes downloading and parsing — on a throttled
// connection that late discovery is what was gating LCP on the hero text.
import outfitFontUrl from '@fontsource/outfit/files/outfit-latin-400-normal.woff2?url'
import plusJakartaSansFontUrl from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2?url'

const { isContactModalOpen, closeContactModal, restoreContactModalFocus } = useContactModal()
const { locale, t } = useI18n()
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
    { name: 'theme-color', content: '#020617' },
    // Only rendered when the token is configured — never an empty meta tag.
    ...(gscToken ? [{ name: 'google-site-verification', content: gscToken }] : []),
  ],
})

// Dev logs
if (import.meta.dev) {
  watch(locale, (newLocale) => {
    console.log('Locale changed to:', newLocale)
    console.log('Summary Translation:', t('summary'))
  }, { immediate: true })
}
</script>
