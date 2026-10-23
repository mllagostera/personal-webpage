<script setup lang="ts">
import type { StackItem } from '~/utils/curriculumVitae'

const { tm, rt } = useI18n()
const technologies = computed(() => {
  const techs = tm('cv.technologies') as unknown as string[]
  return Array.isArray(techs) ? techs.map((t) => t ? rt(t) : '') : []
})
const stack = computed(() => {
  const stk = tm('cv.stack') as unknown as StackItem[]
  return Array.isArray(stk) ? stk.map((s) => ({ icon: rt(s.icon), name: rt(s.name) })) : []
})
</script>
<template>
  <section id="technologies" aria-labelledby="technologies-heading">
    <SectionHeading icon="heroicons:cpu-chip" heading-id="technologies-heading" class="mb-8">{{ $t('technicalSkills') }}</SectionHeading>

    <!-- One card, two columns. The column split is the same as in the soft
         skills card below, so the divider lines up from one section to the
         next. -->
    <div class="glass-card p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 lg:gap-0">
      <div class="lg:pr-10">
        <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">{{ $t('tools') }}</h3>

        <!-- Every logo carries its name: several (Bitbucket, Claude, Symfony,
             Ansible) are not recognisable on their own, and a hover-only label
             never shows on touch screens. -->
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-x-3 gap-y-6 list-none">
          <li
            v-for="item in stack"
            :key="item.icon"
            class="group flex flex-col items-center gap-2 text-center"
          >
            <div class="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary-500/40 group-hover:bg-primary-500/10 transition-colors">
              <div v-if="item.icon.includes('symfony')" class="custom-icon-symfony grayscale group-hover:grayscale-0 contrast-125 transition-all" aria-hidden="true"/>
              <div v-else-if="item.icon.includes('tailwindcss')" class="custom-icon-tailwindcss grayscale group-hover:grayscale-0 contrast-125 transition-all" aria-hidden="true"/>
              <Icon
                v-else
                :name="item.icon"
                size="36px"
                aria-hidden="true"
                class="text-white brightness-200 contrast-125 grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
            <span class="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{{ item.name }}</span>
          </li>
        </ul>
      </div>

      <div class="lg:pl-10 lg:border-l border-white/5">
        <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">{{ $t('workflow') }}</h3>
        <ul class="space-y-3 list-none">
          <li v-for="(item, index) in technologies" :key="index" class="flex items-start gap-3 text-sm text-slate-300">
            <Icon name="heroicons:check-circle" class="text-lg text-primary-500/70 shrink-0" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
