<script setup lang="ts">
// #region [Data]
import type { Company } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const works = computed(() => {
  const workExp = tm('cv.workExperience') as any
  return (Array.isArray(workExp) ? workExp.map((item: any) => ({
    ...item,
    companyName: item.companyName ? rt(item.companyName) : '',
    startDate: item.startDate ? rt(item.startDate) : '',
    endDate: item.endDate ? rt(item.endDate) : '',
    position: item.position ? rt(item.position) : '',
    description: Array.isArray(item.description) ? item.description.map((d: any) => d ? rt(d) : '') : [],
    projects: Array.isArray(item.projects) ? item.projects.map((p: any) => p ? rt(p) : '') : [],
    technologies: Array.isArray(item.technologies) ? item.technologies.map((t: any) => t ? rt(t) : '') : [],
  })) : []) as Company[]
})
// #endregion
const url = useRequestURL()
</script>
<template>
  <div class="mx-auto px-4 2xl:px-0 h-fit mt-12 border-b border-white/10 pb-12">
    <div id="workExperience" v-if="works">
      <div class="flex items-center gap-3 mb-8">
        <Icon name="heroicons:briefcase" class="w-8 h-8 text-primary-400" />
        <h2 class="leading-normal text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
          {{ $t('workExperience') }}
        </h2>
      </div>

      <div class="relative border-l-2 border-slate-700 ml-3 md:ml-6 space-y-12">
        <div
          v-for="(item, index) in works"
          :key="index"
          class="relative pl-8 md:pl-12"
        >
          <!-- Timeline Dot -->
          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-dark-950 border-2 border-primary-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>

          <div class="glass-card p-6 md:p-8 hover:border-primary-500/30 transition-colors duration-300">
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                <div>
                   <h3 class="font-bold text-xl md:text-2xl text-slate-100 font-display">{{ item.position }}</h3>
                   <div class="text-secondary-400 font-semibold text-lg flex items-center gap-2">
                     <Icon name="heroicons:building-office-2" class="w-5 h-5" />
                     {{ item.companyName }}
                   </div>
                </div>
                <div class="text-slate-400 font-mono text-sm bg-dark-800 px-3 py-1 rounded-full border border-slate-700/50 w-fit">
                    {{ item.startDate }} - {{ item.endDate }}
                </div>
            </div>

            <div class="mb-4">
                <span class="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2 block">{{ $t('description') }}</span>
                <ul class="space-y-2">
                    <li
                    v-for="(desc, dIndex) in item.description"
                    :key="dIndex"
                    class="flex items-start gap-3 text-slate-300 leading-relaxed"
                    >
                    <span class="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0"></span>
                    {{ desc }}
                    </li>
                </ul>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700/30">
                 <div v-if="item.projects && item.projects.length">
                    <span class="text-secondary-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{{ $t('projects') }}</span>
                    <div class="flex flex-wrap gap-2">
                        <span 
                            class="px-3 py-1 rounded-md bg-dark-800 border border-secondary-500/20 text-secondary-200 text-sm hover:bg-secondary-500/10 transition-colors" 
                            v-for="project in item.projects" 
                            :key="project"
                        >
                            {{ project }}
                        </span>
                    </div>
                 </div>

                 <div v-if="item.technologies && item.technologies.length">
                    <span class="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3 block">{{ $t('technologies') }}</span>
                    <div class="flex flex-wrap gap-2">
                         <span 
                            class="px-3 py-1 rounded-md bg-dark-800 border border-primary-500/20 text-primary-200 text-sm hover:bg-primary-500/10 transition-colors" 
                            v-for="tech in item.technologies" 
                            :key="tech"
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
