<script lang="ts" setup>
import CaseStudies from '~/components/curriculumVitae/caseStudies.vue'
import GithubProjects from '~/components/curriculumVitae/githubProjects.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/projects')
</script>

<template>
  <div>
    <div class="px-4 sm:px-8 pt-14 pb-10 flex flex-col gap-4">
      <p class="text-sm text-muted" aria-hidden="true">$ ls -la artifacts/</p>
      <h1 class="font-display font-extrabold text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white">
        {{ $t('casesTitle') }}
      </h1>
      <p class="max-w-[680px] font-sans text-lg leading-relaxed text-slate-400 text-pretty">{{ $t('casesSubtitle') }}</p>
    </div>

    <div id="projects" class="px-4 sm:px-8 pb-14">
      <CaseStudies variant="rows" />
    </div>

    <GithubProjects />
  </div>
</template>
