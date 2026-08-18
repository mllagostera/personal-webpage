<script setup lang="ts">
const { awesome } = useAppConfig()

// Rendered server-side as plain text, so crawlers read the address itself
// instead of only finding it behind a mailto: handler or the modal.
const email = computed(() => awesome?.author?.email || '')

const socialLinks = computed(() =>
  [
    { href: awesome?.project?.links?.linkedin, icon: 'mdi:linkedin', label: 'LinkedIn' },
    { href: awesome?.project?.links?.github, icon: 'mdi:github-face', label: 'GitHub' },
    { href: awesome?.project?.links?.x, icon: 'mdi:twitter', label: 'X' },
    { href: awesome?.project?.links?.stackshare, icon: 'mdi:stack-exchange', label: 'StackShare' },
  ].filter((link) => link.href),
)
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

      <div v-if="email" class="pt-2">
        <span class="text-secondary-400 font-semibold text-xs uppercase tracking-wider mb-2 block">
          {{ $t('contactDirectLabel') }}
        </span>
        <a
          :href="`mailto:${email}`"
          class="inline-flex items-center gap-2 text-lg md:text-xl font-semibold text-primary-400 hover:text-primary-300 transition-colors break-all"
        >
          <Icon name="heroicons:envelope" class="w-5 h-5 shrink-0" />
          {{ email }}
        </a>
      </div>

      <div v-if="socialLinks.length" class="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-700/50">
        <a
          v-for="social in socialLinks"
          :key="social.href"
          :href="social.href"
          :title="social.label"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
        >
          <Icon :name="social.icon" class="text-xl" />
          <span>{{ social.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
