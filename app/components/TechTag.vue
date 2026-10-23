<script setup lang="ts">
// One chip for every list of tags on the site. `neutral` is for things that
// are not technologies (project names), so the two lists read apart.
withDefaults(defineProps<{ variant?: 'tech' | 'neutral' }>(), { variant: 'tech' })
</script>

<template>
  <span
    class="px-3 py-1 rounded-md border text-sm transition-colors"
    :class="variant === 'tech'
      ? 'bg-dark-800 border-primary-500/20 text-primary-200 hover:bg-primary-500/10'
      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'"
  >
    <slot />
  </span>
</template>
