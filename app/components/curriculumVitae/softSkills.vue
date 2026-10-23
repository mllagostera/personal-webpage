<script setup lang="ts">
const { tm, rt } = useI18n()
const softskills = computed(() => {
  const skills = tm('cv.softSkills') as unknown as string[]
  return Array.isArray(skills) ? skills.map((s) => rt(s)) : []
})
</script>
<template>
  <section id="softskills" aria-labelledby="softskills-heading">
    <SectionHeading icon="heroicons:sparkles" heading-id="softskills-heading" class="mb-8">{{ $t('softSkills') }}</SectionHeading>

    <!-- Same column split as the technical skills card above. -->
    <div class="glass-card p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 lg:gap-0">
      <div class="lg:pr-10">
        <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">{{ $t('softSkillsEyebrow') }}</h3>
        <blockquote class="border-l-2 border-primary-500/60 pl-6 text-slate-300 italic leading-relaxed text-base md:text-lg">
          {{ $t('SoftSkillsDescription') }}
        </blockquote>
      </div>

      <div class="lg:pl-10 lg:border-l border-white/5">
        <ul class="flex flex-wrap gap-2 list-none">
          <li v-for="(item, index) in softskills" :key="index">
            <TechTag variant="neutral">{{ item }}</TechTag>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
