<script lang="ts" setup>
import WorkExperience from '~/components/curriculumVitae/workExperience.vue'
import Education from '~/components/curriculumVitae/education.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/experience')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden pt-8">
    <WorkExperience class="animate-fade-in-up" />
    <div class="py-4 px-4 2xl:px-0 animate-fade-in-up delay-100">
      <Education />
    </div>
  </div>
</template>
