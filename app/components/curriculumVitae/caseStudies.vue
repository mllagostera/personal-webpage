<script setup lang="ts">
// Cards on the home page, full-width rows on /projects. Either way the whole
// item is clickable: the title link stretches over it with `after:inset-0`,
// so there is one link per item for keyboard and screen reader users instead
// of a card-sized link that reads out every line inside it.
withDefaults(defineProps<{ variant?: 'cards' | 'rows' }>(), { variant: 'cards' })

const { caseStudies } = useCaseStudies()
</script>

<template>
  <ul
    v-if="variant === 'cards'"
    class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4"
  >
    <li
      v-for="item in caseStudies"
      :key="item.slug"
      class="relative p-6 flex flex-col gap-3.5 rounded-[10px] border border-line bg-panel
             transition-[border-color,transform] duration-200 hover:border-primary-500 hover:-translate-y-0.5
             has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-400"
    >
      <div class="flex justify-between gap-3 text-[11px] text-muted">
        <span>{{ item.file }}</span><span>{{ item.years }}</span>
      </div>
      <p class="font-display font-bold text-[40px] leading-none text-primary-400">{{ item.metric }}</p>
      <h3 class="font-display font-bold text-lg leading-[1.3] text-white">
        <NuxtLink :to="item.to" class="after:absolute after:inset-0 focus-visible:outline-none">{{ item.title }}</NuxtLink>
      </h3>
      <p class="font-sans text-sm leading-relaxed text-slate-400">{{ item.summary }}</p>
      <div class="mt-auto flex justify-between gap-3 text-[11px] text-muted">
        <span>{{ item.stack }}</span>
        <span class="shrink-0 text-primary-400" aria-hidden="true">{{ $t('readMore') }} →</span>
      </div>
    </li>
  </ul>

  <ul v-else class="flex flex-col gap-4">
    <li
      v-for="item in caseStudies"
      :key="item.slug"
      class="relative px-6 sm:px-8 py-7 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] items-center gap-6
             rounded-[10px] border border-line bg-panel transition-colors duration-200 hover:border-primary-500
             has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-400"
    >
      <div class="flex flex-col gap-2.5">
        <span class="text-[11px] text-muted">{{ item.file }} · {{ item.years }}</span>
        <span class="font-display font-bold text-[clamp(2.25rem,5vw,3rem)] leading-none text-primary-400">{{ item.metric }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="font-display font-bold text-[22px] leading-[1.25] text-white">
          <NuxtLink :to="item.to" class="after:absolute after:inset-0 focus-visible:outline-none">{{ item.title }}</NuxtLink>
        </h2>
        <p class="font-sans text-[15px] leading-relaxed text-slate-400">{{ item.summary }}</p>
      </div>
      <div class="flex justify-between items-center gap-3">
        <span class="text-[11px] text-muted">{{ item.stack }}</span>
        <span class="text-xl text-primary-400" aria-hidden="true">→</span>
      </div>
    </li>
  </ul>
</template>
