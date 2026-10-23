<script setup lang="ts">
defineProps<{
  icon: string
  headingId?: string
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Sized through font-size, not w-/h-: @nuxt/icon sets `width: 1em`
         outside any cascade layer, so it beats Tailwind's layered utilities. -->
    <Icon :name="icon" class="text-3xl text-primary-400 shrink-0" aria-hidden="true" />
    <h2 :id="headingId" class="leading-normal text-3xl font-display font-bold text-white">
      <slot />
    </h2>
  </div>
</template>
