<script lang="ts" setup>
import WorkExperience from '~/components/curriculumVitae/workExperience.vue'
import Education from '~/components/curriculumVitae/education.vue'
import Skills from '~/components/curriculumVitae/skills.vue'
import Languages from '~/components/curriculumVitae/languages.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/experience')

const { stages, yearsOfExperience } = useCareer()
</script>

<template>
  <div>
    <div class="px-4 sm:px-8 pt-14 pb-10 flex flex-wrap justify-between items-end gap-6">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-muted" aria-hidden="true">$ pipeline describe --verbose</p>
        <h1 class="font-display font-extrabold text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white">
          {{ $t('careerTitle') }}
        </h1>
      </div>
      <p class="flex flex-wrap gap-6 text-[13px] text-slate-400">
        <span><strong class="text-white">{{ stages.length }}</strong> stages</span>
        <span><strong class="text-white">{{ yearsOfExperience }}</strong> {{ $t('yearsUnit') }}</span>
      </p>
    </div>

    <WorkExperience />

    <div class="px-4 sm:px-8 pb-14 flex flex-col gap-4">
      <Education />
      <Skills />
      <Languages />
    </div>
  </div>
</template>
