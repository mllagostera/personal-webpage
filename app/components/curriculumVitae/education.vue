<script setup lang="ts">
// #region [Data]

import type { Education, Certification } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()
const educationRaw = computed(() => tm('cv.education') as unknown as Education)
const education = computed(() => ({
  title: educationRaw.value?.title ? rt(educationRaw.value.title) : '',
  school: educationRaw.value?.school ? rt(educationRaw.value.school) : '',
  scholastic: educationRaw.value?.scholastic ? rt(educationRaw.value.scholastic) : '',
}))
const certifications = computed(() => {
  const certs = tm('cv.certifications') as unknown as Certification[]
  return Array.isArray(certs) ? certs.map((c) => ({
    ...c,
    title: c.title ? rt(c.title) : '',
    school: c.school ? rt(c.school) : '',
    scholastic: c.scholastic ? rt(c.scholastic) : '',
    urlDescription: c.urlDescription ? rt(c.urlDescription) : '',
  })) : []
})
// #endregion
</script>
<template>
  <div class="h-fit">
    <!-- Main Education Block -->
    <div v-if="education" id="education" class="mb-12">
      <div class="flex items-center gap-3 mb-8">
        <Icon name="heroicons:academic-cap" class="w-8 h-8 text-secondary-400" />
        <h2 class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('education') }}
        </h2>
      </div>

      <div class="relative border-l-2 border-slate-700 ml-3 md:ml-6 space-y-8">
        <!-- Formal Education -->
        <div class="relative pl-8 md:pl-12">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-dark-950 border-2 border-secondary-500 shadow-[0_0_10px_rgba(255,255,255,0.3)]"/>
            
            <div class="glass-card p-6 md:p-8 hover:border-secondary-500/30 transition-colors duration-300">
                <h3 class="font-bold text-xl md:text-2xl text-slate-100 font-display mb-1">{{ education.title }}</h3>
                <div class="text-primary-400 font-semibold text-lg flex flex-wrap items-center gap-2">
                    <Icon name="heroicons:building-library" class="w-5 h-5" />
                    <span>{{ education.school }}</span>
                    <span class="text-slate-500">•</span>
                    <span class="text-slate-300">{{ education.scholastic }}</span>
                </div>
            </div>
        </div>

        <!-- Certifications -->
        <div
          v-for="(item, index) in certifications"
          :key="index"
          class="relative pl-8 md:pl-12"
        >
          <div class="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-500"/>
           <div class="glass-card p-5 md:p-6 border-slate-800/50 hover:border-secondary-500/20 transition-colors duration-300">
              <h3 class="font-bold text-lg text-slate-200 font-display flex items-center justify-between">
                  {{ item.title }}
                  <a v-if="item.url" :href="rt(item.url)" target="_blank" class="text-xs font-mono text-secondary-400 border border-secondary-500/30 px-2 py-1 rounded hover:bg-secondary-500/10 transition-colors flex items-center gap-1">
                      {{ item.urlDescription }} <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
                  </a>
              </h3>
              <div class="text-slate-400 font-medium text-sm mt-1 flex flex-wrap items-center gap-2">
                <span>{{ item.school }}</span>
                <span class="w-1 h-1 rounded-full bg-slate-600"/>
                <span>{{ item.scholastic }}</span>
              </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="font-bold text-red-500 underline text-center">
      Please add education in app config
    </div>
  </div>
</template>
