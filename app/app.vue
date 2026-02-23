<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <BackToTop />
  </NuxtLayout>
</template>

<script lang="ts" setup>
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
