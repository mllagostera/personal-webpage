<script setup lang="ts">
const { tm, rt } = useI18n()
const technologies = computed(() => {
  const techs = tm('cv.technologies') as any
  return Array.isArray(techs) ? techs.map((t: any) => t ? rt(t) : '') : []
})
const stack = computed(() => {
  const stk = tm('cv.stack') as any
  return Array.isArray(stk) ? stk.map((s: any) => s ? rt(s) : '') : []
})
</script>
<template>
  <div class="h-fit xl:max-w-[600px]">
    <div id="technologies">
      <div class="">
        <h2 class="leading-normal text-[32px] title-blue">
          {{ $t('technicalSkills') }} 
        </h2>
      </div>
      <p class="font-bold text-xl xl:text-2xl">{{ $t('hardSkills') }}</p>
      <p class="mb-2 font-semibold text-gray-400">
        <span>{{ $t('tools') }}</span>
      </p>
    </div>
    <section class="py-base container">
      <div class="flex flex-wrap gap-3 justify-center">
        <div v-for="(item, index) in stack" :key="index">
              <Icon :name="item" mode='css' size="50px"/>
          </div>
      </div>
    </section>
    <p class="mb-2 font-semibold text-gray-400">
        <span>{{ $t('workflow') }}</span>
      </p>
    <ul class="ml-6">
        <li v-for="(item, index) in technologies" :key="index" class="list-none" >
          <i class="material-symbols-light-check"></i>
          {{ item }}
        </li>
      </ul>
  </div>
</template>
