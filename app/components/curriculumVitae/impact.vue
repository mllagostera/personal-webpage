<script setup lang="ts">
import type { ImpactMetric, Summary } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()

const impact = computed(() => {
  const metrics = tm('cv.impact') as unknown as ImpactMetric[]
  return Array.isArray(metrics)
    ? metrics.map((metric) => {
        const key = rt(metric.key)
        // Dot leaders, so the values start in the same column.
        return { key, value: rt(metric.value), dots: '.'.repeat(Math.max(2, 20 - key.length)) }
      })
    : []
})

const about = computed(() => {
  const summary = tm('cv.summary') as unknown as Summary
  return summary?.about ? rt(summary.about) : ''
})
</script>

<template>
  <div class="px-4 sm:px-8 py-14 grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-10">
    <section class="flex flex-col text-sm leading-[1.9]" aria-labelledby="impact-heading">
      <h2 id="impact-heading" class="m-0 mb-2 font-mono font-normal text-sm text-muted">{{ $t('impactHeading') }}</h2>
      <ul>
        <li v-for="metric in impact" :key="metric.key">
          <span class="text-primary-400" aria-hidden="true">✓</span>
          {{ metric.key }}
          <span class="text-slate-700" aria-hidden="true">{{ metric.dots }}</span> <span class="text-white font-bold">{{ metric.value }}</span>
        </li>
      </ul>
    </section>

    <div class="flex flex-col justify-center gap-4">
      <p class="font-sans text-lg sm:text-xl leading-[1.6] text-slate-300 text-pretty">{{ about }}</p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/projects"
          class="px-5 py-3.5 rounded-lg bg-primary-700 hover:bg-primary-600 font-sans font-bold text-sm leading-none text-white transition-colors"
        >
          {{ $t('heroCtaCases') }} →
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="px-5 py-3.5 rounded-lg border border-slate-500 hover:border-primary-500 font-sans font-medium text-sm leading-none text-slate-200 transition-colors"
        >
          {{ $t('heroCtaContact') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
