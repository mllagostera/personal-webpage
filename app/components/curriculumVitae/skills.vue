<script setup lang="ts">
import type { StackItem } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const stack = computed(() => {
  const stk = tm('cv.stack') as unknown as StackItem[]
  return Array.isArray(stk) ? stk.map((s) => ({ icon: rt(s.icon), name: rt(s.name) })) : []
})
const technologies = computed(() => {
  const techs = tm('cv.technologies') as unknown as string[]
  return Array.isArray(techs) ? techs.map((t) => t ? rt(t) : '') : []
})
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as unknown as string[]
  return Array.isArray(skills) ? skills.map((s) => rt(s)) : []
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <section
      id="technologies"
      class="px-6 sm:px-7 py-6 flex flex-col gap-5 rounded-[10px] border border-line"
      aria-labelledby="technologies-heading"
    >
      <h2 id="technologies-heading" class="font-mono font-normal text-[13px] text-muted">
        <span aria-hidden="true"># stack · </span><span class="lowercase">{{ $t('technicalSkills') }}</span>
      </h2>

      <div class="flex flex-col gap-3">
        <h3 class="font-mono font-normal text-[11px] uppercase tracking-widest text-muted">{{ $t('tools') }}</h3>
        <!-- Every logo carries its name: several (Bitbucket, Claude, Symfony,
             Ansible) are not recognisable on their own. -->
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="item in stack"
            :key="item.icon"
            class="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-line bg-panel text-xs text-slate-300"
          >
            <span v-if="item.icon.includes('symfony')" class="custom-icon-symfony size-4!" aria-hidden="true" />
            <span v-else-if="item.icon.includes('tailwindcss')" class="custom-icon-tailwindcss size-4!" aria-hidden="true" />
            <Icon v-else :name="item.icon" size="16px" class="text-slate-200" aria-hidden="true" />
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="font-mono font-normal text-[11px] uppercase tracking-widest text-muted">{{ $t('workflow') }}</h3>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="(item, index) in technologies"
            :key="index"
            class="grid grid-cols-[18px_1fr] font-sans text-sm leading-relaxed text-slate-300"
          >
            <span class="font-mono text-primary-400" aria-hidden="true">✓</span><span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section
      id="softskills"
      class="px-6 sm:px-7 py-6 flex flex-col gap-5 rounded-[10px] border border-line"
      aria-labelledby="softskills-heading"
    >
      <h2 id="softskills-heading" class="font-mono font-normal text-[13px] text-muted">
        <span aria-hidden="true"># soft-skills · </span><span class="lowercase">{{ $t('softSkills') }}</span>
      </h2>
      <p class="pl-4 border-l-2 border-primary-500/60 font-sans text-base leading-relaxed text-slate-300 text-pretty">
        {{ $t('SoftSkillsDescription') }}
      </p>
      <ul class="flex flex-wrap gap-1.5">
        <li v-for="(item, index) in softskills" :key="index"><TechTag variant="neutral">{{ item }}</TechTag></li>
      </ul>
    </section>
  </div>
</template>
