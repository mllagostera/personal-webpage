<script setup lang="ts">
// #region [Data]
import type { Project } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const projects = computed(() => {
  const projs = tm('cv.projects') as any
  return (Array.isArray(projs) ? projs.map((item: any) => ({
    ...item,
    name: item.name ? rt(item.name) : '',
    startDate: item.startDate ? rt(item.startDate) : '',
    endDate: item.endDate ? rt(item.endDate) : '',
    description: item.description ? rt(item.description) : '',
    tools: item.tools ? rt(item.tools) : '',
    technologies: item.technologies ? rt(item.technologies) : '',
    release: item.release ? rt(item.release) : '',
    url: item.url ? rt(item.url) : '',
  })) : []) as Project[]
})
// #endregion
const url = useRequestURL()
</script>
<template>
  <div class="mx-auto px-4 2xl:px-0 h-fit mt-4">
    <div v-if="projects">
      <div id="projects" class="">
        <h2 class="leading-normal text-[32px] title-blue">
          {{ $t('projects') }}
        </h2>
      </div>
      <div class="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in projects"
          :key="index"
          class="max-w-[600px]"
          :class="{
            'border-b border-b-white pb-4 xl:border-b-0':
              index !== projects.length - 1,
          }"
        >
          <p class="font-bold text-xl xl:text-2xl">{{ item.name }}</p>
          <p class="mb-2 font-semibold text-gray-400">
            <span>{{ item.startDate }}</span> - <span>{{ item.endDate }}</span>
          </p>
          <div v-if="item.description">
            <span class="font-bold">{{ $t('description') }}:</span>
            <span class="px-2">{{ item.description }}</span>
          </div>
          <div v-if="item.tools">
            <span class="font-bold">{{ $t('tools') }}:</span>
            <span class="px-2">{{ item.tools }}</span>
          </div>
          <div v-if="item.technologies">
            <span class="font-bold">{{ $t('technologies') }}:</span>
            <span class="px-2">{{ item.technologies }}</span>
          </div>
          <div v-if="item.release">
            <span class="font-bold">{{ $t('release') }}:</span>
            <span class="px-2">{{ item.release }}</span>
          </div>
          <div v-if="item.url">
            <span class="font-bold">{{ $t('release') }}:</span>
            <span class="px-2">{{ item.url }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red underline">
      Please add projects in app config
    </div>
  </div>
</template>
