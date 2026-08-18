<script lang="ts" setup>
import Personal from '~/components/curriculumVitae/personal.vue'
import WorkExperience from '~/components/curriculumVitae/workExperience.vue'
import HardSkills from '~/components/curriculumVitae/hardSkills.vue'
import SoftSkills from '~/components/curriculumVitae/softSkills.vue'
import Education from '~/components/curriculumVitae/education.vue'
import Projects from '~/components/curriculumVitae/projects.vue'
import GithubProjects from '~/components/curriculumVitae/githubProjects.vue'
import Languages from '~/components/curriculumVitae/languages.vue'

definePageMeta({ layout: 'page' })

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})

// Title, description, canonical, Open Graph and Twitter Cards for this route.
useSiteSeo({ path: '/' })
useProfileJsonLd('/')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden">
    <Personal class="animate-fade-in-up" />
    <WorkExperience class="animate-fade-in-up delay-100" />
    <div class="py-4 px-4 2xl:px-0 grid grid-cols-1 xl:grid-cols-2 gap-8 border-b border-white/10 animate-fade-in-up delay-200">
      <Education />
      <Languages />
    </div>
    <div class="py-4 px-4 2xl:px-0 grid grid-cols-1 xl:grid-cols-2 gap-8 border-b border-white/10 animate-fade-in-up delay-300">
      <HardSkills />
      <SoftSkills />
    </div>
    <Projects class="animate-fade-in-up delay-400" />
    <GithubProjects class="animate-fade-in-up delay-500" />
  </div>
</template>
