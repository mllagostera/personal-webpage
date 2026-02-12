<script setup lang="ts">
// #region [Data]

import type { Education } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()
const educationRaw = computed(() => tm('cv.education') as any)
const education = computed(() => ({
  title: educationRaw.value?.title ? rt(educationRaw.value.title) : '',
  school: educationRaw.value?.school ? rt(educationRaw.value.school) : '',
  scholastic: educationRaw.value?.scholastic ? rt(educationRaw.value.scholastic) : '',
}))
const certifications = computed(() => {
  const certs = tm('cv.certifications') as any
  return Array.isArray(certs) ? certs.map((c: any) => ({
    ...c,
    title: c.title ? rt(c.title) : '',
    school: c.school ? rt(c.school) : '',
    scholastic: c.scholastic ? rt(c.scholastic) : '',
    urlDescription: c.urlDescription ? rt(c.urlDescription) : '',
  })) : []
})
// #endregion
const url = useRequestURL()
</script>
<template>
  <div class="h-fit">
    <div id="education" v-if="education">
      <div class="">
        <h2 class="leading-normal text-[32px] title-blue">
          {{ $t('education') }}
        </h2>
      </div>
      <div class="pl-2">
        <div class="font-bold text-2xl">{{ education.title }}</div>
        <div class="font-semibold text-gray-400">
          <span>{{ education.school }}</span>,
          <span>{{ education.scholastic }}</span>
        </div>
      </div>
      <div
          v-for="(item, index) in certifications"
          class="pl-2"
        >
          <p class="font-bold text-2xl">{{ item.title }}</p>
          <p class="mb-2 font-semibold text-gray-400">
            <span>{{ item.school }}</span>, <span>{{ item.scholastic }}</span> 
            <span v-if="item.url"> - <a class="button" :href="item.url">{{ item.urlDescription }}🔗</a></span>
          </p>
        </div>
    </div>
    <div v-else class="font-bold text-red underline">
      Please add education in app config
    </div>
  </div>
</template>
