<script lang="ts" setup>
import Hero from '~/components/curriculumVitae/hero.vue'
import Pipeline from '~/components/curriculumVitae/pipeline.vue'
import Impact from '~/components/curriculumVitae/impact.vue'
import CaseStudies from '~/components/curriculumVitae/caseStudies.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/')
// The profile schema belongs to the landing page, which is the profile itself.
useProfileJsonLd('/')
</script>

<template>
  <div>
    <Hero />
    <Pipeline />
    <Impact />

    <section class="px-4 sm:px-8 pb-14 flex flex-col gap-5" aria-labelledby="cases-heading">
      <div class="flex flex-wrap justify-between gap-3 text-sm">
        <h2 id="cases-heading" class="m-0 font-mono font-normal text-sm text-muted">
          <span aria-hidden="true"># artifacts/ — </span>{{ $t('casesHeading') }}
        </h2>
        <NuxtLink to="/projects" class="text-primary-400 hover:text-primary-300 transition-colors">ls -la artifacts/ →</NuxtLink>
      </div>
      <CaseStudies variant="cards" />
    </section>

    <section
      class="mx-4 sm:mx-8 mb-14 px-6 sm:px-8 py-7 flex flex-wrap justify-between items-center gap-6
             rounded-[10px] border border-dashed border-primary-500"
      aria-labelledby="cta-heading"
    >
      <div class="flex flex-col gap-2">
        <p class="text-[13px] text-muted" aria-hidden="true">$ ./contact --to miquel</p>
        <h2 id="cta-heading" class="font-display font-bold text-[26px] leading-tight text-white">{{ $t('ctaTitle') }}</h2>
        <p class="text-xs text-slate-400">{{ $t('ctaBody') }}</p>
      </div>
      <NuxtLink
        to="/contact"
        class="flex items-center gap-2 px-5 py-3.5 rounded-md bg-primary-500 hover:bg-primary-400 text-ink-950 font-bold text-sm transition-colors"
      >
        <Icon name="heroicons:paper-airplane" aria-hidden="true" />
        {{ $t('heroCtaContact') }}
      </NuxtLink>
    </section>
  </div>
</template>
