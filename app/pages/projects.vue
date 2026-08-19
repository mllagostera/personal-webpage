<script lang="ts" setup>
import Projects from '~/components/curriculumVitae/projects.vue'
import GithubProjects from '~/components/curriculumVitae/githubProjects.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/projects')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden pt-8">
    <h1 class="sr-only">{{ $t('pageTitleProjects') }}</h1>
    <Projects class="animate-fade-in-up" />
    <GithubProjects class="animate-fade-in-up delay-100" />
  </div>
</template>
