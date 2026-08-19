<script setup lang="ts">
const { tm, rt } = useI18n()
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as unknown as string[]
  return Array.isArray(skills) ? skills.map((s) => rt(s)) : []
})
</script>
<template>
  <div class="h-fit w-full">
    <div id="softskills" class="mb-8">
       <div class="flex items-center gap-3">
        <Icon name="heroicons:sparkles" class="w-8 h-8 text-white/80" />
        <h2 class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('softSkills') }}
        </h2>
      </div>
    </div>

    <!-- Description Quote -->
    <div class="relative mb-10 group">
        <!-- Background decorative element -->
        <div class="absolute -top-6 -left-6 w-12 h-12 bg-primary-500/10 rounded-full blur-xl group-hover:bg-primary-500/20 transition-all duration-700"/>
        
        <blockquote class="relative glass-card p-8 md:p-10 border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden">
            <!-- Decorative Large Quote Icon -->
            <Icon name="tabler:quote" class="absolute -top-2 -right-2 w-24 h-24 text-primary-500/5 rotate-12" />
            
            <div class="relative z-10 flex gap-6">
                <!-- Side Accent Bar -->
                <div class="flex-shrink-0 w-1.5 rounded-full bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent"/>
                
                <div class="space-y-4">
                    <p class="text-slate-300 italic leading-relaxed text-base md:text-lg font-medium">
                        {{ $t('SoftSkillsDescription') }}
                    </p>
                    
                    <!-- Optional: Source/Role indicator if needed, for now just a subtle finisher -->
                    <div class="flex items-center gap-2 pt-2">
                        <div class="w-4 h-px bg-primary-500/30"/>
                        <span class="text-[10px] uppercase tracking-[0.2em] text-primary-500 font-bold">Philosophy & Mindset</span>
                    </div>
                </div>
            </div>
        </blockquote>
    </div>

    <!-- Skills List Grid -->
    <div class="glass-card p-8 border border-white/5 relative overflow-hidden group">
        <h3 class="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span class="w-8 h-px bg-primary-500/30"/>
            {{ $t('softSkills') }}
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <div 
                v-for="(item, index) in softskills" 
                :key="index" 
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group/item"
            >
                <Icon name="heroicons:check-badge" class="w-5 h-5 text-white/20 group-hover/item:text-primary-500/50 transition-colors" />
                <span class="text-slate-400 group-hover/item:text-slate-200 font-medium transition-colors text-sm md:text-base">{{ item }}</span>
            </div>
        </div>
    </div>
  </div>
</template>
