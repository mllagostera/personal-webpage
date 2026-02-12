<script setup lang="ts">
// #region [Data]
import type { Company } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const works = computed(() => {
  const workExp = tm('cv.workExperience') as any
  return (Array.isArray(workExp) ? workExp.map((item: any) => ({
    ...item,
    companyName: item.companyName ? rt(item.companyName) : '',
    startDate: item.startDate ? rt(item.startDate) : '',
    endDate: item.endDate ? rt(item.endDate) : '',
    position: item.position ? rt(item.position) : '',
    description: Array.isArray(item.description) ? item.description.map((d: any) => d ? rt(d) : '') : [],
    projects: Array.isArray(item.projects) ? item.projects.map((p: any) => p ? rt(p) : '') : [],
    technologies: Array.isArray(item.technologies) ? item.technologies.map((t: any) => t ? rt(t) : '') : [],
  })) : []) as Company[]
})
// #endregion
const url = useRequestURL()
</script>
<template>
  <div class="mx-auto px-4 2xl:px-0 h-fit mt-4 border-b border-b-gray-300">
    <div id="workExperience" v-if="works">
      <div class="">
        <h2 class="leading-normal text-[32px] title-blue">
          {{ $t('workExperience') }}
        </h2>
      </div>
      <div class="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in works"
          :key="index"
          class="max-w-[600px]"
          :class="{
            'border-b border-b-white pb-4 xl:border-b-0':
              index !== works.length - 1,
          }"
        >
          <p class="font-bold text-xl xl:text-2xl">{{ item.position }}</p>
          <p class="mb-2 font-semibold text-gray-400">
            <span>{{ item.companyName }}</span
            >, <span>{{ item.startDate }}</span> -
            <span>{{ item.endDate }}</span>
          </p>
          <div class="font-semibold">{{ $t('description') }}:</div>
          <ul class="pl-4">
            <li
              v-for="(desc, index) in item.description"
              :key="index"
              class="list-disc"
            >
              {{ desc }}
            </li>
          </ul>
          <div v-if="item.projects">
            <span class="font-semibold">{{ $t('projects') }}</span>
            <div class="tag-container">
              <p>
                 <span class="tag-item" v-for="project in item.projects" :key="project">{{ project }}</span>
              </p>
            </div>
          </div>
          <div v-if="item.technologies">
            <span class="font-semibold">{{ $t('technologies') }}</span>
            <div class="tag-container">
              <p>
                 <span class="tag-item" v-for="tech in item.technologies" :key="tech">{{ tech }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red underline">
      Please add work experience in app config
    </div>
  </div>
</template>
