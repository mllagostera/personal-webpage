<script lang="ts" setup>
import Personal from '~/components/curriculumVitae/personal.vue'
import HardSkills from '~/components/curriculumVitae/hardSkills.vue'
import SoftSkills from '~/components/curriculumVitae/softSkills.vue'
import Languages from '~/components/curriculumVitae/languages.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/')
// The profile schema belongs to the landing page, which is the profile itself.
useProfileJsonLd('/')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden">
    <!-- No entrance animation here: this is the hero / LCP candidate, and
         gating it behind opacity:0 delays both LCP and Speed Index. -->
    <Personal />
    <!-- One rule for every section below the hero: a heading and a single
         full-width card, stacked with the same spacing. Side-by-side columns
         of independently sized cards never lined up. The cards already mark
         where each section ends, so there are no rules between them. -->
    <div class="px-4 2xl:px-0 pt-12 pb-8 space-y-16 animate-fade-in-up delay-200">
      <HardSkills />
      <SoftSkills />
      <Languages />
    </div>
  </div>
</template>
