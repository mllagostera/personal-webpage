<script setup lang="ts">
import type { Personal } from '~/utils/curriculumVitae'

const { awesome } = useAppConfig()
const { tm, rt } = useI18n()
const { careerStartYear } = useCareer()

const personalRaw = computed(() => tm('cv.information') as unknown as Personal)

const nameWords = computed(() => {
  const fullName = personalRaw.value?.fullName ? rt(personalRaw.value.fullName) : awesome?.name || ''
  return fullName.split(' ')
})

// The position is one `│`-separated line of specialities; the city closes it.
const tagline = computed(() => {
  const position = personalRaw.value?.position ? rt(personalRaw.value.position) : ''
  const city = personalRaw.value?.city ? rt(personalRaw.value.city) : ''
  return [...position.split('│').map((item) => item.trim()), city].filter(Boolean)
})

const handle = computed(() => (awesome?.name || '').toLowerCase().replace(/\s+/g, '-'))
</script>

<template>
  <section id="about" class="px-4 sm:px-8 pt-14 sm:pt-[72px] pb-14 flex flex-col gap-7">
    <!-- Decoration: the heading and tagline below say the same in words. -->
    <!-- Always one line, like a real prompt. Below `sm` the full command
         (~58 characters) cannot fit at a readable size, so it drops the
         handle — the name is right below in the heading — and the rest
         (~40 characters) scales with the viewport down to 320px. Kept on one
         source line: the compiler drops whitespace that spans a newline
         between two elements. -->
    <p class="whitespace-nowrap text-[clamp(0.6875rem,3.4vw,0.875rem)] sm:text-[15px] text-muted" aria-hidden="true">
      $ <span class="text-slate-200">deploy</span> <span class="hidden sm:inline">{{ handle }}</span> <span class="text-primary-400">--env=production</span> --since={{ careerStartYear }}<span class="prompt-cursor" />
    </p>

    <!-- No entrance animation: this is the LCP candidate, and gating it
         behind opacity:0 delays both LCP and Speed Index. One word per line,
         with the space kept inside the span so the text still reads as a
         name when the styling is gone. -->
    <h1
      class="m-0 font-display font-extrabold uppercase text-white tracking-[-0.03em] leading-[0.92]
             text-[clamp(2.75rem,9vw,7rem)]"
    >
      <span v-for="(word, index) in nameWords" :key="index" class="block">{{ word }}{{ index < nameWords.length - 1 ? ' ' : '' }}</span>
    </h1>

    <ul class="flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
      <li v-for="(item, index) in tagline" :key="item" class="flex gap-4">
        <span v-if="index" class="text-slate-700" aria-hidden="true">│</span>
        <span :class="index === 0 ? 'text-primary-400' : ''">{{ item }}</span>
      </li>
    </ul>
  </section>
</template>
