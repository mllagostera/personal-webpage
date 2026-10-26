<script setup lang="ts">
// One chip for every list of tags on the site. `neutral` is for things that
// are not technologies (project names), so the two lists read apart.
withDefaults(defineProps<{ variant?: 'tech' | 'neutral' }>(), { variant: 'tech' })
</script>

<template>
  <span
    class="inline-block px-2 py-1 rounded border font-mono text-xs"
    :class="variant === 'tech'
      ? 'bg-chip border-primary-500/25 text-emerald-200'
      : 'bg-white/5 border-line text-slate-300'"
  >
    <slot />
  </span>
</template>
