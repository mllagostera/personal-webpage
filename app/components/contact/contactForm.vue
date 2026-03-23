<script setup lang="ts">
const { awesome } = useAppConfig()
const { openContactModal } = useContactModal()

const socialLinks = computed(() => [
  { href: awesome?.project?.links?.github, icon: 'mdi:github', label: 'GitHub', color: 'hover:text-white' },
  { href: awesome?.project?.links?.linkedin, icon: 'mdi:linkedin', label: 'LinkedIn', color: 'hover:text-blue-400' },
  { href: awesome?.project?.links?.x, icon: 'mdi:twitter', label: 'Twitter', color: 'hover:text-sky-400' },
  { href: `mailto:${awesome?.author?.email}`, icon: 'heroicons:envelope', label: 'Email', color: 'hover:text-primary-400' },
].filter(link => link.href))
</script>

<template>
  <div class="glass-card h-full relative overflow-hidden p-8 md:p-10 flex flex-col justify-center border border-white/10">

    <div class="relative z-10 space-y-6">
      <h2 class="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
        {{ $t('contactHeroTitle') }}
      </h2>
      
      <p class="text-slate-400 text-sm leading-relaxed">
        {{ $t('contactHeroDescription') }}
      </p>

      <div class="flex flex-col gap-4 pt-2">
        <button 
          @click="openContactModal"
          class="group relative inline-flex items-center justify-center gap-3 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(var(--color-primary-500),0.5)] active:scale-95 overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-2">
            <Icon name="heroicons:paper-airplane" class="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {{ $t('contactSend') }}
          </span>
        </button>

        <div class="flex items-center justify-center gap-2">
          <a 
            v-for="social in socialLinks" 
            :key="social.href"
            :href="social.href"
            target="_blank"
            class="p-3 rounded-lg bg-white/5 border border-white/10 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:scale-110 active:scale-95"
            :class="social.color"
            :title="social.label"
          >
            <Icon :name="social.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
