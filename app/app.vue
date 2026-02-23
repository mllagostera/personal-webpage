<script lang="ts" setup>
const { awesome } = useAppConfig()

const { locale, t } = useI18n()
watch(locale, (newLocale) => {
  console.log('LOCALE CHANGED TO:', newLocale)
  console.log('SUMMARY TRANSLATION:', t('summary'))
}, { immediate: true })

useHead({
  title: awesome.name,
  titleTemplate: `%s - ${awesome.name}`,
})
</script>

<template>
  <Body
    class="antialiased duration-300 transition-colors"
  >
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
      <div>
        <slot />
        <BackToTop />
      </div>
    </NuxtLayout>
  </Body>
</template>
