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
const typewriterStyle = computed(() => {
  const text = personal.value.position || ''
  const length = text.length
  return {
    '--typewriter-steps': Math.max(1, length),
    '--typewriter-width': length + 'ch',
    '--typewriter-duration': Math.max(2, length * 0.1) + 's'
  }
})
// #endregion
const url = useRequestURL()
useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: [
    { name: 'theme-color', content: '#020617' }
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
  <div class="mx-auto pb-12 px-4 2xl:px-0 h-fit border-b border-white/10 relative overflow-x-hidden">
    <!-- Starry Background Elements (Optional extra decoration) -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

    <div id="about" v-if="personal" class="pt-20">
      <div class="text-center mb-16 relative">
        <h1
          class="font-display font-bold uppercase text-4xl sm:text-5xl md:text-7xl xl:text-8xl mb-4 tracking-tight"
        >
          <span class="cosmic-text text-glow">{{ author.name }}</span>
        </h1>
        <div class="flex justify-center">
            <h2
            class="leading-normal mt-0 text-xl md:text-3xl title-blue line-1 anim-typewriter font-light text-slate-300"
            :style="typewriterStyle"
            :key="personal.position"
            >
            {{ personal.position }}
            </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
        <!-- Summary Card -->
        <div class="xl:col-span-7 glass-card p-8 hover:bg-dark-900/60 transition-colors duration-300">
          <div class="leading-normal text-3xl font-display text-primary-400 mb-6 flex items-center gap-3">
             <Icon name="heroicons:user" class="w-8 h-8" />
            {{ $t('summary') }}
          </div>
          <ul class="space-y-3">
            <li
              v-for="(item, index) in summaryDetail"
              :key="index"
              class="flex items-start gap-3 text-slate-300 text-lg leading-relaxed"
            >
              <span class="mt-2 w-1.5 h-1.5 rounded-full bg-secondary-400 flex-shrink-0"></span>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Contact Card -->
        <div id="contact" class="xl:col-span-5 space-y-4">
            <div class="glass-card p-8 h-full flex flex-col justify-center">
                <div class="leading-normal text-3xl font-display text-secondary-400 mb-6 flex items-center gap-3">
                    <Icon name="heroicons:identification" class="w-8 h-8" />
                    {{ $t('about') }}
                </div>
                
                <div v-show="author.name" class="mb-6">
                    <div class="text-slate-400 text-sm uppercase tracking-wider mb-1">Location</div>
                    <div class="text-xl text-slate-100 flex items-center gap-2">
                         <Icon name="heroicons:map-pin" class="w-5 h-5 text-primary-400" />
                        {{ author.name }} - {{ author.city }} 
                    </div>
                </div>

                <div v-show="author.email">
                   <div class="text-slate-400 text-sm uppercase tracking-wider mb-1">{{ $t('Email') }}</div>
                    <a :href="`mailto:${author.email}`" class="text-base sm:text-xl text-slate-100 hover:text-primary-400 transition-colors flex items-center gap-2 break-all">
                        <Icon name="heroicons:envelope" class="w-5 h-5 text-secondary-400 flex-shrink-0" />
                        {{ author.email }}
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red-500 underline text-center pt-20">
      Please add personal information in app config
    </div>
  </div>
</template>

<style scoped lang="postcss">
.text-glow {
  text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}
</style>
