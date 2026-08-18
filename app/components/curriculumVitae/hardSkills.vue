<script setup lang="ts">
const { tm, rt } = useI18n()
const technologies = computed(() => {
  const techs = tm('cv.technologies') as unknown as string[]
  return Array.isArray(techs) ? techs.map((t) => t ? rt(t) : '') : []
})
const stack = computed(() => {
  const stk = tm('cv.stack') as unknown as string[]
  return Array.isArray(stk) ? stk.map((s) => s ? rt(s) : '') : []
})
</script>
<template>
  <div class="h-fit w-full">
    <div id="technologies" class="mb-8">
      <div class="flex items-center gap-3">
         <Icon name="heroicons:cpu-chip" class="w-8 h-8 text-white/80" />
         <h2 class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('technicalSkills') }}
        </h2>
      </div>
    </div>

    <!-- Main Stack Grid -->
    <div class="glass-card p-8 md:p-10 mb-8 border border-white/5 relative overflow-hidden">
        <!-- Decoration light -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"/>

        <h3 class="font-bold text-xs uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-2">
          <span class="w-8 h-px bg-primary-500/30"/>
          {{ $t('tools') }}
        </h3>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-x-4 gap-y-10">
            <div 
                v-for="(item, index) in stack" 
                :key="index"
                class="group relative flex flex-col items-center justify-center p-2"
            >
                <div class="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_-10px_rgba(var(--color-primary-500),0.3)]">
                    <div v-if="item.includes('symfony')" class="custom-icon-symfony grayscale hover:grayscale-0 contrast-125 transition-all duration-300"/>
                    <div v-else-if="item.includes('tailwindcss')" class="custom-icon-tailwindcss grayscale hover:grayscale-0 contrast-125 transition-all duration-300"/>
                    <Icon 
                      v-else
                      :name="item" 
                      size="36px" 
                      class="text-white brightness-200 contrast-125 grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                </div>
                
                <!-- Label on hover -->
                <span class="absolute -bottom-6 text-[10px] font-bold uppercase tracking-tighter text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-primary-400 transition-all duration-300">
                  {{ item.split(':').pop()?.replace('-plain', '') }}
                </span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-8">
        <!-- Workflow -->
         <div class="glass-card p-8 border border-white/5 relative overflow-hidden group">
            <h3 class="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <Icon name="heroicons:arrow-path" class="w-4 h-4 text-white/40" />
                {{ $t('workflow') }}
            </h3>
             <ul class="grid grid-cols-1 gap-3">
                <li v-for="(item, index) in technologies" :key="index + 'flow'" class="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors duration-300" >
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-white/20 group-hover:text-primary-500/50 transition-colors" />
                   <span class="text-sm font-medium">{{ item }}</span>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>
