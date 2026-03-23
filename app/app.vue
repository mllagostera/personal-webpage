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
const { awesome } = useAppConfig()
const { locale, t } = useI18n()

// Seo & Metadata
useHead({
  title: awesome.name,
  titleTemplate: `%s - ${awesome.name}`,
  htmlAttrs: {
    lang: locale
  }
})

// Dev logs
if (import.meta.dev) {
  watch(locale, (newLocale) => {
    console.log('Locale changed to:', newLocale)
    console.log('Summary Translation:', t('summary'))
  }, { immediate: true })
}
</script>
