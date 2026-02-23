<script setup lang="ts">
const { tm, rt } = useI18n()
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as any
  return Array.isArray(skills) ? skills.map((s: any) => rt(s)) : []
})
</script>
<template>
  <div class="h-fit w-full">
    <div id="softskills" class="mb-8">
       <!-- Header (Hidden on desktop if aligned with Hard Skills, but good to have semantically) -->
       <!-- In original layout, it was next to HardSkills. Keeping structure similar but improved. -->
       <div class="flex items-center gap-3 mb-4">
        <Icon name="heroicons:sparkles" class="w-8 h-8 text-secondary-400" />
        <h2 class="leading-normal text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400">
          {{ $t('softSkills') }}
        </h2>
      </div>
      
      <div class="glass-card p-6 border-l-4 border-l-secondary-500">
        <p class="text-slate-300 italic leading-relaxed">
            "{{ $t('SoftSkillsDescription') }}"
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-4">
        <div 
            v-for="(item, index) in softskills" 
            :key="index" 
            class="group relative px-6 py-3 rounded-full bg-dark-800 border border-slate-700 hover:border-secondary-500/50 transition-all duration-300 hover:scale-105 cursor-default overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-secondary-500/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-3 relative z-10">
            <Icon name="heroicons:check-badge" class="text-secondary-400 text-xl group-hover:text-secondary-300" />
            <span class="text-slate-200 font-medium tracking-wide group-hover:text-white">{{ item }}</span>
          </div>
        </div>
      </div>
  </div>
</template>
