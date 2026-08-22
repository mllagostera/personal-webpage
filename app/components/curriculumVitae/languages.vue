<script setup lang="ts">
// #region [Data]

import type { Language } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()
const languages = computed(() => {
  const langs = tm('cv.languages') as unknown as Language[]
  return Array.isArray(langs) ? langs.map((l) => ({
    ...l,
    name: l.name ? rt(l.name) : '',
    level: l.level ? rt(l.level) : '',
    levelLabel: l.levelLabel ? rt(l.levelLabel) : '',
    // A plain number in the locale, so it comes back without `rt()`.
    proficiency: Number(l.proficiency) || 0,
    flag: l.flag ? rt(l.flag) : '',
  })) : []
})
// #endregion
</script>
<template>
  <div class="h-fit">
    <!-- Main Languages Block -->
    <div v-if="languages" class="mb-12">
      <div class="flex items-center gap-3 mb-8">
        <Icon name="heroicons:language" class="w-8 h-8 text-primary-400" />
        <h2 class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('languages') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(item, index) in languages" 
            :key="index" 
            class="glass-card p-6 flex items-center gap-6 group hover:bg-dark-900/60 transition-colors duration-300"
          >
             <!-- Flag Circle with Pulse Effect -->
             <div class="relative flex-shrink-0">
                 <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"/>
                 <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700/50 relative z-10 bg-dark-900 flex items-center justify-center">
                    <!-- Every flag is 4:3, so an icon squared off at 64px is
                         letterboxed: the flag only covers the middle 64x48 and
                         the card background shows through top and bottom of the
                         circle. Scaling by 4/3 makes the short side match the
                         circle; the sides overflow and are cropped by the
                         parent, so the flag covers the whole disc. -->
                    <Icon :name="item.flag" size="64px" class="opacity-90 shrink-0 scale-[1.3334]"/>
                 </div>
             </div>

             <div class="flex-grow">
                 <div class="flex justify-between items-center mb-2">
                     <h3 class="font-bold text-xl text-slate-100 font-display">{{ item.name }}</h3>
                     <span
                        class="text-xs font-bold px-2 py-1 rounded bg-dark-950/50 border border-slate-700 text-secondary-400"
                        :class="{ 'text-primary-400 border-primary-500/30': item.level === 'native' }"
                     >
                        {{ item.levelLabel }}
                     </span>
                 </div>

                 <!-- Progress Bar. Decorative: the same figure is written out as
                      text underneath, so there is nothing for a meter to add. -->
                 <div class="h-2 w-full bg-dark-950 rounded-full overflow-hidden">
                     <div
                        class="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                        :style="{ width: `${item.proficiency}%` }"
                     />
                 </div>
                 <div class="text-right mt-1 text-xs text-slate-400 font-mono">
                     {{ item.proficiency }}% {{ $t('proficiency') }}
                 </div>
             </div>
          </div>
      </div>
    </div>
    
    <div v-else class="font-bold text-red-500 underline text-center">
      Please add language in app config
    </div>
  </div>
</template>
