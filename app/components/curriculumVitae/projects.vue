<script setup lang="ts">
// #region [Data]
import type { Project } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const projects = computed(() => {
  const projs = tm('cv.projects') as unknown as Project[]
  return (Array.isArray(projs) ? projs.map((item) => ({
    ...item,
    name: item.name ? rt(item.name) : '',
    startDate: item.startDate ? rt(item.startDate) : '',
    endDate: item.endDate ? rt(item.endDate) : '',
    description: item.description ? rt(item.description) : '',
    tools: item.tools ? rt(item.tools) : '',
    technologies: item.technologies ? rt(item.technologies) : '',
    url: item.url ? rt(item.url) : '',
  })) : []) as Project[]
})
// The locale files keep tools and technologies as one comma-separated string.
const splitList = (value: string) => value.split(',').map((v) => v.trim()).filter(Boolean)
// #endregion
</script>
<template>
  <div class="mx-auto px-4 2xl:px-0 h-fit mt-12 mb-24">
    <div v-if="projects">
      <div id="projects" class="mb-8">
        <SectionHeading icon="heroicons:presentation-chart-bar">{{ $t('projects') }}</SectionHeading>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in projects"
          :key="index"
          class="glass-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 border-slate-700/50"
        >
          <!-- Gradient overlay on hover -->
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

          <div class="p-6 md:p-8 relative z-10 flex flex-col h-full">
              <div class="flex justify-between items-start mb-4">
                  <h3 class="font-bold text-xl md:text-2xl text-slate-100 font-display group-hover:text-primary-300 transition-colors">{{ item.name }}</h3>
                  <div class="text-xs font-mono text-slate-400 bg-dark-950/50 px-2 py-1 rounded border border-slate-800">
                    {{ item.startDate }} – {{ item.endDate }}
                  </div>
              </div>

            <div v-if="item.description" class="mb-6 flex-grow">
               <span class="text-secondary-400 font-semibold text-xs uppercase tracking-wider mb-2 block">{{ $t('description') }}</span>
               <p class="text-slate-300 text-sm leading-relaxed">
                   {{ item.description }}
               </p>
            </div>

            <div class="space-y-4 mt-auto">
                <div v-if="item.tools" class="border-t border-slate-700/50 pt-4">
                    <span class="text-secondary-400 font-semibold text-xs uppercase tracking-wider mb-3 block">{{ $t('tools') }}</span>
                    <div class="flex flex-wrap gap-2">
                        <TechTag v-for="tool in splitList(item.tools)" :key="tool">{{ tool }}</TechTag>
                    </div>
                </div>
                <div v-if="item.technologies" class="border-t border-slate-700/50 pt-4">
                    <span class="text-secondary-400 font-semibold text-xs uppercase tracking-wider mb-3 block">{{ $t('technologies') }}</span>
                    <div class="flex flex-wrap gap-2">
                        <TechTag v-for="tech in splitList(item.technologies)" :key="tech">{{ tech }}</TechTag>
                    </div>
                </div>
                
                 <div v-if="item.url" class="flex flex-wrap gap-4 pt-4 mt-2">
                      <a :href="item.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm font-bold text-secondary-400 hover:text-secondary-300 transition-colors ml-auto">
                         {{ $t('viewProject') }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
                         <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
                     </a>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red-500 underline text-center py-8">
      Please add projects in app config
    </div>
  </div>
</template>
