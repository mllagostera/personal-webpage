<script setup lang="ts">
// #region [Data]

import type { Language } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()
const languages = computed(() => {
  const langs = tm('cv.languages') as any
  return Array.isArray(langs) ? langs.map((l: any) => ({
    ...l,
    name: l.name ? rt(l.name) : '',
    level: l.level ? rt(l.level) : '',
    flag: l.flag ? rt(l.flag) : '',
  })) : []
})
// #endregion
const url = useRequestURL()
</script>
<template>
  <div class="h-fit">
    <div v-if="languages">
      <div class="">
        <h2 class="leading-normal text-[32px] title-blue">
          {{ $t('languages') }}
        </h2>
      </div>
      <div>
          <div v-for="(item, index) in languages" class="text-xl xl:text-xl ">
            <Icon :name="item.flag" mode='css'/> {{ item.name }} <span v-if="item.level == 'native'" class="mb-2 font-semibold text-gray-400">C2</span><span v-else class="mb-2 font-semibold text-gray-400">B2</span>
          </div>
      </div>
    </div>
    <div v-else class="font-bold text-red underline">
      Please add language in app config
    </div>
  </div>
</template>
