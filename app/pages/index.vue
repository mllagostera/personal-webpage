<script lang="ts" setup>
import Personal from '~/components/curriculumVitae/personal.vue'
import HardSkills from '~/components/curriculumVitae/hardSkills.vue'
import SoftSkills from '~/components/curriculumVitae/softSkills.vue'
import Languages from '~/components/curriculumVitae/languages.vue'

definePageMeta({ layout: 'page' })

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})

useSiteSeo('/')
// The profile schema belongs to the landing page, which is the profile itself.
useProfileJsonLd('/')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden">
    <Personal class="animate-fade-in-up" />
    <div class="py-4 px-4 2xl:px-0 grid grid-cols-1 xl:grid-cols-2 gap-8 border-b border-white/10 animate-fade-in-up delay-200">
      <HardSkills />
      <SoftSkills />
    </div>
    <div class="py-4 px-4 2xl:px-0 animate-fade-in-up delay-300">
      <Languages />
    </div>
  </div>
</template>
