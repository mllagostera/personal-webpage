<script setup lang="ts">
// #region [Data]
import type { Personal, Summary } from '~/utils/curriculumVitae'

const nuxtApp = useNuxtApp()
const { awesome } = useAppConfig()
const { tm, rt, locale } = useI18n()
const personalRaw = computed(() => tm('cv.information') as any)
const personal = computed(() => ({
  fullName: personalRaw.value?.fullName ? rt(personalRaw.value.fullName) : '',
  position: personalRaw.value?.position ? rt(personalRaw.value.position) : '',
}))
const author = computed(
  () => (awesome?.author as Personal) || ({ name: '', fullName: '', position: '' } as Personal),
)
const summaryDetail = computed(() => {
  const detail = tm('cv.summary.summary') as any
  return Array.isArray(detail) ? detail.map((s: any) => s ? rt(s) : '') : []
})
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as any
  return Array.isArray(skills) ? skills.map((s: any) => rt(s)) : []
})
// #endregion
const url = useRequestURL()
useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: [
    { name: 'theme-color', content: String(nuxtApp?.$colorMode?.preference || 'light') }
  ]
})
useSeoMeta({
  robots: { index: true, follow: true },
  googleSiteVerification: '',
  title: personal.value.fullName || 'CV',
  description: summaryDetail.value.join(' '),
  ogType: 'website',
  ogImage: '/thumbnail.png',
  ogSiteName: personal.value.fullName,
  ogTitle: personal.value.fullName || 'CV',
  ogDescription: summaryDetail.value.join(' '),
  ogUrl: url.href,
  twitterTitle: personal.value.fullName || 'CV',
  twitterDescription: summaryDetail.value.join(' '),
  twitterCreator: awesome?.author?.name,
  twitterImage: '/thumbnail.png',
  twitterImageAlt: awesome?.author?.name,
  twitterSite: url.host,
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="mx-auto pb-4 px-4 2xl:px-0 h-fit border-b border-b-gray-300">
    <div id="about" v-if="personal">
      <div class="sticky top-0">
        <h1
          class="leading-8 mt-6 font-bold uppercase text-3xl xl:text-[48px] dark:text-primary-500"
        >
          {{ author.name }}
        </h1>
        <h2 class="leading-normal mt-0 text-2xl xl:text-[38px] title-blue line-1 anim-typewriter">
          {{ personal.position }}
        </h2>
      </div>
      <div class="flex flex-col-reverse xl:flex-row gap-4 mt-4">
        <div class="max-w-[620px]">
          <div class="leading-normal text-[32px] title-blue">
            {{ $t('summary') }}
          </div>
          <ul class="p-4">
            <li
              v-for="(item, index) in summaryDetail"
              :key="index"
              class="list-disc"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div id="contact" class="space-y-4 min-w-[600px]">
          <div class="leading-normal text-[32px] title-blue">
            {{ $t('about') }}
          </div>
          <div v-show="author.name">
            <div>{{ author.name }} - {{ author.city }} </div>
          </div>
          <div v-show="author.email">
            <div class="title-secondary">{{ $t('Email') }}</div>
            <div>{{ author.email }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red underline">
      Please add personal information in app config
    </div>
  </div>
</template>
