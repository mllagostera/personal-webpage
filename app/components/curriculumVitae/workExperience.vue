<script setup lang="ts">
// #region [Data]
import type { Company } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const works = computed(() => {
  const workExp = tm('cv.workExperience') as unknown as Company[]
  return (Array.isArray(workExp) ? workExp.map((item) => ({
    ...item,
    companyName: item.companyName ? rt(item.companyName) : '',
    startDate: item.startDate ? rt(item.startDate) : '',
    endDate: item.endDate ? rt(item.endDate) : '',
    position: item.position ? rt(item.position) : '',
    description: Array.isArray(item.description) ? item.description.map((d) => d ? rt(d) : '') : [],
    projects: Array.isArray(item.projects) ? item.projects.map((p) => p ? rt(p) : '') : [],
    technologies: Array.isArray(item.technologies) ? item.technologies.map((t) => t ? rt(t) : '') : [],
  })) : []) as Company[]
})
// #endregion
</script>
<template>
  <div class="mx-auto px-4 2xl:px-0 h-fit mt-12 border-b border-white/10 pb-12">
    <div v-if="works" id="workExperience">
      <div class="flex items-center gap-3 mb-8">
        <Icon name="heroicons:briefcase" class="w-8 h-8 text-primary-400" />
        <h2 class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('workExperience') }}
        </h2>
      </div>

      <div class="relative md:ml-40 space-y-8 md:space-y-16">
        <!-- Vertical Line (Desktop only) -->
        <div class="hidden md:block absolute left-[-1.5px] top-4 bottom-0 w-[3px] bg-gradient-to-b from-primary-500 via-primary-500/50 to-transparent"/>

        <div
          v-for="(item, index) in works"
          :key="index"
          class="md:relative md:pl-16"
        >
          <!-- Date indicator (Desktop only: on the left) -->
          <div class="hidden md:block absolute right-full mr-10 top-0 text-right">
            <div class="text-white font-display font-bold text-xl leading-tight">{{ item.endDate }}</div>
            <div class="text-slate-400 text-xs uppercase tracking-tight leading-tight">{{ item.startDate }}</div>
          </div>

          <!-- Timeline Dot (Desktop only) -->
          <div class="hidden md:block absolute md:left-[-9px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-[3px] border-primary-500 z-10 box-content">
            <div class="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20"/>
          </div>

          <div class="glass-card p-6 md:p-8 hover:border-primary-500/30 transition-all duration-300 hover:translate-x-1 group">
             <!-- Mobile Date (Integrated in card) -->
            <div class="md:hidden flex flex-wrap items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 w-fit">
                <Icon name="heroicons:calendar-days" class="w-4 h-4 text-primary-400" />
                <span class="text-slate-100 font-bold text-sm">{{ item.endDate }}</span>
                <span class="text-slate-400 text-xs font-medium uppercase">{{ item.startDate }}</span>
            </div>
            <div class="flex flex-col mb-6">
                <h3 class="font-bold text-2xl md:text-3xl text-slate-100 font-display group-hover:text-primary-400 transition-colors">
                  {{ item.position }}
                </h3>
                <div class="text-slate-400 font-semibold text-lg flex items-center gap-2 mt-1">
                  <Icon name="heroicons:building-office-2" class="w-5 h-5 text-secondary-400" />
                  {{ item.companyName }}
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-widest">
                  <span class="w-8 h-px bg-primary-400/30"/>
                  {{ $t('description') }}
                </div>
                <ul class="space-y-3">
                    <li
                    v-for="(desc, dIndex) in item.description"
                    :key="dIndex"
                    class="flex items-start gap-3 text-slate-300 leading-relaxed text-base md:text-lg"
                    >
                    <Icon name="heroicons:chevron-double-right" class="w-4 h-4 mt-1.5 text-primary-500/50 flex-shrink-0" />
                    {{ desc }}
                    </li>
                </ul>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-white/5">
                 <div v-if="item.projects && item.projects.length">
                    <span class="text-secondary-400 font-bold text-xs uppercase tracking-widest mb-4 block">{{ $t('projects') }}</span>
                    <div class="flex flex-wrap gap-2">
                        <span 
                            v-for="project in item.projects" 
                            :key="project" 
                            class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-all"
                        >
                            {{ project }}
                        </span>
                    </div>
                 </div>

                 <div v-if="item.technologies && item.technologies.length">
                    <span class="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{{ $t('technologies') }}</span>
                    <div class="flex flex-wrap gap-2">
                         <span 
                            v-for="tech in item.technologies" 
                            :key="tech" 
                            class="px-3 py-1 rounded-md bg-dark-800 border border-primary-500/20 text-primary-200 text-sm hover:bg-primary-500/10 transition-colors"
                        >
                            {{ tech }}
                        </span>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red-500 underline text-center py-8">
      Please add work experience in app config
    </div>
  </div>
</template>
