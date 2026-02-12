<script setup lang="ts">
const { tm, rt } = useI18n()
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as any
  return Array.isArray(skills) ? skills.map((s: any) => rt(s)) : []
})
</script>
<template>
  <div class="h-fit xl:max-w-[600px]">
    <div id="technologies">
      <div class="">
        <h2 class="leading-normal text-[32px] title-blue">
        <br>
        </h2>
      </div>
      <p class="font-bold text-xl xl:text-2xl">{{ $t('softSkills') }}</p>
      <div class="font-semibold">{{ $t('SoftSkillsDescription') }}:</div>
    </div>
    <ul class="ml-6 mt-4">
        <li v-for="(item, index) in softskills" :key="index" class="list-none flex items-center gap-2" >
          <Icon name="heroicons:check-circle" class="text-primary-500 text-lg" />
          {{ item }}
        </li>
      </ul>
  </div>
</template>
