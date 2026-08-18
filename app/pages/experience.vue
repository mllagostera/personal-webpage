<script lang="ts" setup>
import WorkExperience from '~/components/curriculumVitae/workExperience.vue'
import Education from '~/components/curriculumVitae/education.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/experience')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden pt-8">
    <!-- The visible section headings are h2 with h3 cards under them, so
         promoting one to h1 would leave an h1 -> h3 jump. A screen-reader-only
         h1 gives the page a title without touching the design. -->
    <h1 class="sr-only">{{ $t('pageTitleExperience') }}</h1>
    <WorkExperience class="animate-fade-in-up" />
    <div class="py-4 px-4 2xl:px-0 animate-fade-in-up delay-100">
      <Education />
    </div>
  </div>
</template>
