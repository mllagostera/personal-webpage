<script setup lang="ts">
// #region [Data]

import type { Education, Certification } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()
const educationRaw = computed(() => tm('cv.education') as unknown as Education)
const education = computed(() => ({
  title: educationRaw.value?.title ? rt(educationRaw.value.title) : '',
  school: educationRaw.value?.school ? rt(educationRaw.value.school) : '',
  scholastic: educationRaw.value?.scholastic ? rt(educationRaw.value.scholastic) : '',
}))
const certifications = computed(() => {
  const certs = tm('cv.certifications') as unknown as Certification[]
  return Array.isArray(certs) ? certs.map((c) => ({
    title: c.title ? rt(c.title) : '',
    school: c.school ? rt(c.school) : '',
    scholastic: c.scholastic ? rt(c.scholastic) : '',
    urlDescription: c.urlDescription ? rt(c.urlDescription) : '',
    url: c.url ? rt(c.url) : '',
  })) : []
})
// #endregion
</script>
<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
    <section
      id="education"
      class="px-6 sm:px-7 py-6 flex flex-col gap-4 rounded-[10px] border border-line"
      aria-labelledby="education-heading"
    >
      <h2 id="education-heading" class="font-mono font-normal text-[13px] text-muted">
        <span aria-hidden="true"># build-deps · </span><span class="lowercase">{{ $t('education') }}</span>
      </h2>
      <div class="flex flex-col gap-1">
        <h3 class="font-display font-bold text-xl leading-[1.3] text-white">{{ education.title }}</h3>
        <p class="font-sans text-sm text-slate-400">{{ education.school }} · {{ education.scholastic }}</p>
      </div>
    </section>

    <section
      v-if="certifications.length"
      class="px-6 sm:px-7 py-6 flex flex-col gap-3.5 rounded-[10px] border border-line"
      aria-labelledby="certifications-heading"
    >
      <h2 id="certifications-heading" class="font-mono font-normal text-[13px] text-muted">
        <span aria-hidden="true"># signatures · </span><span class="lowercase">{{ $t('certifications') }}</span>
      </h2>
      <ul class="flex flex-col divide-y divide-line">
        <li
          v-for="item in certifications"
          :key="item.title"
          class="flex justify-between items-baseline gap-4 py-3.5 first:pt-0 last:pb-0"
        >
          <div class="flex flex-col gap-0.5">
            <h3 class="font-display font-bold text-base text-white">{{ item.title }}</h3>
            <p class="font-sans text-[13px] text-slate-400">{{ item.school }} · {{ item.scholastic }}</p>
          </div>
          <a
            v-if="item.url"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            {{ item.urlDescription }} ↗<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
