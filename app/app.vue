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
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950"
  >
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>
