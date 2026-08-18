<script setup lang="ts">
// #region [Data]
import type { Personal } from '~/utils/curriculumVitae'

const { awesome } = useAppConfig()
const { tm, rt } = useI18n()
const personalRaw = computed(() => tm('cv.information') as unknown as Personal)
const personal = computed(() => ({
  fullName: personalRaw.value?.fullName ? rt(personalRaw.value.fullName) : '',
  position: personalRaw.value?.position ? rt(personalRaw.value.position) : '',
}))
const author = computed(
  () => (awesome?.author as Personal) || ({ name: '', fullName: '', position: '' } as Personal),
)
const summaryDetail = computed(() => {
  const detail = tm('cv.summary.summary') as unknown as string[]
  return Array.isArray(detail) ? detail.map((s) => s ? rt(s) : '') : []
})
const typewriterStyle = computed(() => {
  const text = personal.value.position || ''
  const length = text.length
  return {
    '--typewriter-steps': Math.max(1, length),
    '--typewriter-width': length + 'ch',
    '--typewriter-duration': Math.max(2, length * 0.1) + 's'
  }
})
// #endregion
</script>

<template>
  <div class="mx-auto pb-12 px-4 2xl:px-0 h-fit border-b border-white/10 relative overflow-x-hidden">
    <!-- Subtle Background Elements (Optional extra decoration) -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"/>

    <div v-if="personal" id="about" class="pt-20">
      <div class="text-center mb-16 relative">
        <h1
          class="font-display font-bold uppercase text-4xl sm:text-5xl md:text-7xl xl:text-8xl mb-4 tracking-tight"
        >
          <span class="cosmic-text">{{ author.name }}</span>
        </h1>
        <div class="flex justify-center">
            <h2
            :key="personal.position"
            class="leading-normal mt-0 text-xl md:text-3xl title-blue line-1 anim-typewriter font-light text-slate-300"
            :style="typewriterStyle"
            >
            {{ personal.position }}
            </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 mt-4">
        <!-- Summary Card - Takes full width since contact is now in global menu -->
        <div class="glass-card p-8 hover:bg-dark-900/60 transition-colors duration-300">
          <div class="leading-normal text-3xl font-display text-primary-400 mb-6 flex items-center gap-3">
             <Icon name="heroicons:user" class="w-8 h-8" />
            {{ $t('summary') }}
          </div>
          <ul class="space-y-3">
            <li
              v-for="(item, index) in summaryDetail"
              :key="index"
              class="flex items-start gap-3 text-slate-300 text-lg leading-relaxed"
            >
              <span class="mt-2 w-1.5 h-1.5 rounded-full bg-secondary-400 flex-shrink-0"/>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="font-bold text-red-500 underline text-center pt-20">
      Please add personal information in app config
    </div>
  </div>
</template>


