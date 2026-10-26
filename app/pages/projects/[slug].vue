<script lang="ts" setup>
import { SITE_ROUTES } from '~~/shared/site'

definePageMeta({
  layout: 'page',
  // A case study exists only if it is an indexable route: anything else under
  // /projects/ is a 404, with no page rendered first.
  validate: (route) => SITE_ROUTES.some((siteRoute) => siteRoute.path === route.path),
})

const route = useRoute()
const { caseStudies } = useCaseStudies()

const index = computed(() => caseStudies.value.findIndex((item) => item.to === route.path))
const caseStudy = computed(() => caseStudies.value[index.value])
const nextCase = computed(() => caseStudies.value[(index.value + 1) % caseStudies.value.length])

// In SITE_ROUTES but missing from the locale files: a content bug, but still
// a missing page rather than an empty one.
if (!caseStudy.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
}

useSiteSeo(route.path)
</script>

<template>
  <article v-if="caseStudy">
    <nav :aria-label="$t('breadcrumb')" class="px-4 sm:px-8 pt-12 text-[13px] text-muted">
      <NuxtLink to="/projects" class="text-primary-400 hover:text-primary-300 transition-colors">artifacts</NuxtLink>
      /
      <span class="text-slate-200" aria-current="page">{{ caseStudy.file }}</span>
    </nav>

    <div class="px-4 sm:px-8 pt-6 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 min-w-0 flex flex-col gap-5">
        <h1 class="font-display font-extrabold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.02em] text-white text-pretty">
          {{ caseStudy.title }}
        </h1>
        <p class="font-sans text-lg sm:text-xl leading-relaxed text-slate-300 text-pretty">{{ caseStudy.lead }}</p>
      </div>
      <dl class="self-start px-6 py-5 flex flex-col gap-3 rounded-[10px] border border-line text-[13px]">
        <div v-for="fact in caseStudy.facts" :key="fact.label" class="flex justify-between gap-4">
          <dt class="text-muted">{{ fact.label }}</dt>
          <dd class="text-right text-slate-200">{{ fact.value }}</dd>
        </div>
      </dl>
    </div>

    <!-- A diff of the one number the case moved. -->
    <div class="mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-2 rounded-[10px] border border-line bg-panel text-[15px]">
      <div class="px-6 sm:px-8 py-7 flex flex-col gap-2.5 border-b sm:border-b-0 sm:border-r border-line">
        <span class="text-red-400">- {{ $t('caseBefore') }}</span>
        <span class="font-display font-bold text-[clamp(2.5rem,6vw,3.25rem)] leading-none text-red-300">{{ caseStudy.before }}</span>
        <span class="text-[13px] text-slate-400">{{ caseStudy.unit }}</span>
      </div>
      <div class="px-6 sm:px-8 py-7 flex flex-col gap-2.5">
        <span class="text-primary-400">+ {{ $t('caseAfter') }}</span>
        <span class="font-display font-bold text-[clamp(2.5rem,6vw,3.25rem)] leading-none text-primary-400">{{ caseStudy.after }}</span>
        <span class="text-[13px] text-slate-400">{{ caseStudy.unit }}</span>
      </div>
    </div>

    <div class="max-w-[760px] px-4 sm:px-8 py-12 flex flex-col gap-7">
      <section class="flex flex-col gap-2.5" aria-labelledby="steps-heading">
        <h2 id="steps-heading" class="font-display font-bold text-[22px] text-white">{{ $t('caseWhatIDid') }}</h2>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="(step, stepIndex) in caseStudy.steps"
            :key="stepIndex"
            class="grid grid-cols-[18px_1fr] font-sans text-base leading-relaxed text-slate-300"
          >
            <span class="font-mono text-primary-400" aria-hidden="true">›</span><span>{{ step }}</span>
          </li>
        </ul>
      </section>

      <figure
        v-if="caseStudy.flow.length"
        class="px-6 py-6 flex flex-col gap-4 rounded-[10px] border border-line
               bg-[repeating-linear-gradient(135deg,var(--color-panel)_0_10px,var(--color-panel-hover)_10px_20px)]"
      >
        <figcaption class="text-xs text-muted"># {{ $t('caseFlow') }}</figcaption>
        <ol class="flex flex-wrap items-center gap-x-2 gap-y-3 text-[13px]">
          <li v-for="(step, stepIndex) in caseStudy.flow" :key="step" class="flex items-center gap-2">
            <span v-if="stepIndex" class="text-primary-400" aria-hidden="true">→</span>
            <span class="px-3 py-2 rounded-md border border-primary-500/25 bg-chip text-emerald-200">{{ step }}</span>
          </li>
        </ol>
      </figure>

      <ul class="flex flex-wrap gap-1.5" :aria-label="$t('technologies')">
        <li v-for="tech in caseStudy.technologies" :key="tech"><TechTag>{{ tech }}</TechTag></li>
      </ul>
    </div>

    <div class="mx-4 sm:mx-8 mb-14 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
      <div class="p-6 flex flex-wrap justify-between items-center gap-4 rounded-[10px] border border-dashed border-primary-500">
        <div class="flex flex-col gap-1">
          <p class="font-display font-bold text-lg text-white">{{ $t('ctaTitle') }}</p>
          <p class="text-xs text-slate-400">{{ $t('ctaBody') }}</p>
        </div>
        <NuxtLink
          to="/contact"
          class="px-3.5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-400 text-ink-950 font-bold text-[13px] transition-colors"
        >
          {{ $t('heroCtaContact') }}
        </NuxtLink>
      </div>

      <div
        v-if="nextCase && nextCase !== caseStudy"
        class="relative p-6 flex justify-between items-center gap-4 rounded-[10px] border border-line
               hover:border-primary-500 transition-colors
               has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-400"
      >
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted">{{ $t('caseNext') }}</span>
          <NuxtLink :to="nextCase.to" class="font-display font-bold text-lg text-white after:absolute after:inset-0 focus-visible:outline-none">
            {{ nextCase.title }}
          </NuxtLink>
        </div>
        <span class="text-xl text-primary-400" aria-hidden="true">→</span>
      </div>
    </div>
  </article>
</template>
