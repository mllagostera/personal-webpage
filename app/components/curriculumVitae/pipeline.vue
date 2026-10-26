<script setup lang="ts">
const { t } = useI18n()
const { stages, yearsOfExperience } = useCareer()

// Oldest first: the pipeline runs left to right, from the first job to the
// one still running.
const timeline = computed(() => [...stages.value].reverse())

const stageYears = (stage: (typeof stages.value)[number]) => stage.isCurrent
  ? `${stage.startYear} → ${t('stageNow')}`
  : `${stage.startYear}–${stage.endYear}`
</script>

<template>
  <section class="mx-4 sm:mx-8 px-5 sm:px-8 py-7 rounded-[10px] border border-line bg-panel" aria-labelledby="pipeline-heading">
    <h2 id="pipeline-heading" class="sr-only">{{ $t('careerTitle') }}</h2>
    <div class="flex flex-wrap justify-between gap-3 mb-6 text-xs text-muted">
      <span aria-hidden="true">pipeline #{{ yearsOfExperience }} · {{ stages.length }} stages · main</span>
      <NuxtLink to="/experience" class="text-primary-400 hover:text-primary-300 transition-colors">
        ● running · {{ $t('pipelineDetail', { years: yearsOfExperience }) }} →
      </NuxtLink>
    </div>

    <ol class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-6">
      <li v-for="stage in timeline" :key="stage.n" class="flex flex-col gap-2.5 pr-3">
        <div class="flex items-center gap-2" aria-hidden="true">
          <span
            class="size-[26px] shrink-0 grid place-items-center rounded-full text-ink-950 text-sm"
            :class="stage.isCurrent ? 'bg-running' : 'bg-primary-500'"
          >
            <Icon :name="stage.isCurrent ? 'heroicons:play-20-solid' : 'heroicons:check-20-solid'" />
          </span>
          <span class="flex-1 h-0.5 bg-primary-500/50" />
        </div>
        <span class="text-[11px] text-muted">{{ stageYears(stage) }}</span>
        <span class="font-display font-bold text-[15px] leading-[1.3] text-slate-100">{{ stage.stage }}</span>
      </li>
    </ol>
  </section>
</template>
