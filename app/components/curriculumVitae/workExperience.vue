<script setup lang="ts">
const { stages } = useCareer()

// The three most recent stages start open: they carry the path to DevOps, and
// the older ones are a click away. Collapsed stages are hidden with `v-show`,
// so their text is still in the server-rendered HTML.
const openStages = ref(new Set(stages.value.slice(0, 3).map((stage) => stage.n)))

const toggle = (n: number) => {
  if (openStages.value.has(n)) openStages.value.delete(n)
  else openStages.value.add(n)
}
</script>

<template>
  <ol id="workExperience" class="px-4 sm:px-8 pb-12 flex flex-col">
    <li v-for="stage in stages" :key="stage.n" class="grid grid-cols-[28px_minmax(0,1fr)] sm:grid-cols-[40px_minmax(0,1fr)]">
      <div class="flex flex-col items-center" aria-hidden="true">
        <span
          class="mt-[26px] size-[26px] shrink-0 grid place-items-center rounded-full text-ink-950 text-sm"
          :class="stage.isCurrent ? 'bg-running' : 'bg-primary-500'"
        >
          <Icon :name="stage.isCurrent ? 'heroicons:play-20-solid' : 'heroicons:check-20-solid'" />
        </span>
        <span class="flex-1 w-0.5 bg-primary-500/35" />
      </div>

      <article class="my-3 ml-2 sm:ml-0 overflow-hidden rounded-[10px] border border-line bg-panel">
        <h2 class="m-0">
          <button
            type="button"
            class="w-full px-5 sm:px-7 py-5 flex justify-between items-center gap-4 text-left hover:bg-panel-hover transition-colors"
            :aria-expanded="openStages.has(stage.n)"
            :aria-controls="`stage-${stage.n}`"
            @click="toggle(stage.n)"
          >
            <span class="flex flex-col gap-1.5">
              <span class="flex flex-wrap gap-x-4 gap-y-1 font-mono font-normal text-xs text-muted">
                <span>stage {{ stage.n }}/{{ stages.length }}</span>
                <span>{{ stage.startDate }} – {{ stage.endDate }}</span>
                <span :class="stage.isCurrent ? 'text-running' : 'text-primary-400'">{{ stage.isCurrent ? '● running' : '✓ passed' }}</span>
              </span>
              <span class="font-display font-bold text-xl sm:text-2xl leading-tight text-white">{{ stage.position }}</span>
              <span class="font-sans font-medium text-[15px] text-slate-400">{{ stage.companyName }}</span>
            </span>
            <span class="shrink-0 whitespace-nowrap font-mono font-normal text-[13px] text-muted" aria-hidden="true">
              {{ openStages.has(stage.n) ? `[−] ${$t('stageCollapse')}` : '[+] logs' }}
            </span>
          </button>
        </h2>

        <div
          v-show="openStages.has(stage.n)"
          :id="`stage-${stage.n}`"
          class="px-5 sm:px-7 pt-5 pb-6 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 border-t border-line"
        >
          <ul class="flex flex-col gap-1.5">
            <li
              v-for="(line, index) in stage.description"
              :key="index"
              class="grid grid-cols-[18px_1fr] font-sans text-sm leading-relaxed text-slate-300"
            >
              <span class="font-mono text-primary-400" aria-hidden="true">›</span><span>{{ line }}</span>
            </li>
          </ul>

          <div class="flex flex-col gap-5">
            <div v-if="stage.technologies.length" class="flex flex-col gap-2.5">
              <h3 class="font-mono font-normal text-[11px] uppercase tracking-widest text-muted">
                <span aria-hidden="true">deps</span><span class="sr-only">{{ $t('technologies') }}</span>
              </h3>
              <ul class="flex flex-wrap gap-1.5">
                <li v-for="tech in stage.technologies" :key="tech"><TechTag>{{ tech }}</TechTag></li>
              </ul>
            </div>
            <div v-if="stage.projects.length" class="flex flex-col gap-2.5">
              <h3 class="font-mono font-normal text-[11px] uppercase tracking-widest text-muted">{{ $t('projects') }}</h3>
              <ul class="flex flex-wrap gap-1.5">
                <li v-for="project in stage.projects" :key="project"><TechTag variant="neutral">{{ project }}</TechTag></li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </li>
  </ol>
</template>
