<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <BackToTop />

    <!-- Global Contact Modal -->
    <ContactModal :is-open="isContactModalOpen" @close="isContactModalOpen = false">
      <ContactFormContent />
    </ContactModal>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import ContactModal from '~/components/contact/ContactModal.vue'
import ContactFormContent from '~/components/contact/ContactFormContent.vue'

const { isContactModalOpen } = useContactModal()
const { locale, t } = useI18n()
const { gscToken } = useRuntimeConfig().public

// Site-wide head. Per-route title/description/canonical live in `useSiteSeo`.
useHead({
  htmlAttrs: {
    lang: locale,
  },
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
