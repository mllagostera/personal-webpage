<script setup lang="ts">
// #region [Data]
import type { Personal, Summary } from '~/utils/curriculumVitae'

const nuxtApp = useNuxtApp()
const { awesome } = useAppConfig()
const { locale } = useI18n()
const personal = computed(
  () => awesome?.curriculumVitae[locale.value].information as Personal,
)

const author = computed(
  () => awesome?.author as Personal,
)
const summary = computed(
  () => awesome?.curriculumVitae[locale.value]?.summary as Summary,
)
const summaryDetail = computed(() => {
  const detail = summary.value?.summary
  const type = typeof detail
  return type === 'string' ? detail.split(';') : detail
})
// #endregion
const url = useRequestURL()
useSeoMeta({
  'content-language': locale.value,
  'theme-color': nuxtApp.$colorMode.preference,
  language: locale.code,
  googlebot: 'CV template, ' + summaryDetail.value.join(' '),
  'google-site-verification': process.env.GG_SEARCH_CONSOLE,
  title: personal.value.fullName || 'CV',
  description: summaryDetail.value.join(' '),
  ogType: 'website',
  ogImage: '/thumbnail.png',
  ogSiteName: personal.value.fullName,
  ogTitle: personal.value.fullName || 'CV',
  ogDescription: summaryDetail.value.join(' '),
  ogUrl: url.href,
  'twitter:title': personal.value.fullName || 'CV',
  'twitter:description': summaryDetail.value.join(' '),
  'twitter:author': awesome?.author?.name,
  'twitter:image': '/thumbnail.png',
  'twitter:image:alt': awesome?.author?.name,
  'twitter:site': url.host,
  'twitter:creator': awesome?.author?.name,
  'twitter:card': 'summary_large_image',
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
