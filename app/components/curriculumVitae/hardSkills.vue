<script setup lang="ts">
const { tm, rt } = useI18n()
const technologies = computed(() => {
  const techs = tm('cv.technologies') as any
  return Array.isArray(techs) ? techs.map((t: any) => t ? rt(t) : '') : []
})
const stack = computed(() => {
  const stk = tm('cv.stack') as any
  return Array.isArray(stk) ? stk.map((s: any) => s ? rt(s) : '') : []
})
</script>
<template>
  <div class="h-fit w-full">
    <div id="technologies" class="mb-8">
      <div class="flex items-center gap-3">
         <Icon name="heroicons:cpu-chip" class="w-8 h-8 text-primary-400" />
         <h2 class="leading-normal text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
          {{ $t('technicalSkills') }}
        </h2>
      </div>
    </div>

    <!-- Main Stack Grid -->
    <div class="glass-card p-6 md:p-8 mb-8">
        <h3 class="font-bold text-xl text-slate-200 mb-6 font-display">{{ $t('hardSkills') }}</h3>
        <div class="flex flex-wrap gap-6 justify-center">
            <div 
                v-for="(item, index) in stack" 
                :key="index"
                class="group relative flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
            >
                <div class="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon :name="item" size="48px" class="relative z-10 filter drop-shadow-lg" />
            </div>
        </div>
    </div>

    <!-- Tools & Workflow Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Tools -->
        <div class="glass-card p-6">
            <h3 class="font-bold text-lg text-slate-300 mb-4 flex items-center gap-2">
                <Icon name="heroicons:wrench-screwdriver" class="w-5 h-5 text-secondary-400" />
                {{ $t('tools') }}
            </h3>
            <!-- Assuming 'technologies' might contain tools based on previous usage, or we just keep the list structure if data isn't separated -->
             <ul class="space-y-2">
                <li v-for="(item, index) in technologies" :key="index" class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors" >
                 <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-500" />
                  {{ item }}
                </li>
            </ul>
        </div>

        <!-- Workflow (placeholder if distinct from technologies, reusing technologies list for now based on previous file structure) -->
         <div class="glass-card p-6">
            <h3 class="font-bold text-lg text-slate-300 mb-4 flex items-center gap-2">
                 <Icon name="heroicons:arrow-path" class="w-5 h-5 text-primary-400" />
                {{ $t('workflow') }}
            </h3>
             <ul class="space-y-2">
                 <!-- Using same list for now as original file reused it or logic was ambiguous. 
                      If 'technologies' covers both, we display it simply. 
                      refining to just show the content elegantly. -->
                <li v-for="(item, index) in technologies" :key="index + 'flow'" class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors" >
                  <Icon name="heroicons:check" class="w-4 h-4 text-secondary-400" />
                  {{ item }}
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>
