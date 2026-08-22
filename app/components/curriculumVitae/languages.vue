<script setup lang="ts">
// #region [Data]

import type { Language } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()

/** Optional strings come back from `tm()` as message objects, or missing. */
const text = (value: unknown) => (value ? rt(value as string) : '')

const languages = computed(() => {
  const langs = tm('cv.languages') as unknown as Language[]
  return Array.isArray(langs) ? langs.map((l) => {
    const certification = l.certification
      ? {
          title: text(l.certification.title),
          issuer: text(l.certification.issuer),
          // A plain number in the locale, so it comes back without `rt()`.
          year: Number(l.certification.year) || undefined,
          url: text(l.certification.url),
        }
      : undefined

    return {
      name: text(l.name),
      bcp47: text(l.bcp47),
      level: text(l.level),
      usage: text(l.usage),
      evidence: text(l.evidence),
      note: text(l.note),
      certification,
      flag: text(l.flag),
    }
  }) : []
})

type LanguageEntry = (typeof languages.value)[number]

const hasDetails = (item: LanguageEntry) =>
  Boolean(item.usage || item.evidence || item.note || item.certification)
// #endregion
</script>
<template>
  <div class="h-fit">
    <!-- Main Languages Block -->
    <div v-if="languages.length" class="mb-12">
      <div class="flex items-center gap-3 mb-8">
        <Icon name="heroicons:language" class="w-8 h-8 text-primary-400" />
        <h2 id="languages-heading" class="leading-normal text-3xl font-display font-bold text-white">
          {{ $t('languages') }}
        </h2>
      </div>

      <!-- A list of languages, each described by a definition list: the level,
           the usage and the evidence are named values, not free prose. -->
      <!-- One column per language from `lg` up, so the grid stretches all three
           to the same height and no entry dominates the row. Below that they
           stack full width, which suits the narrower measure better than two
           cramped columns. -->
      <ul class="grid grid-cols-1 lg:grid-cols-3 gap-6 list-none p-0" aria-labelledby="languages-heading">
        <li
          v-for="item in languages"
          :key="item.bcp47"
          class="glass-card p-6 hover:bg-dark-900/60 transition-colors duration-300"
        >
          <!-- Flag, name and level share a header row; the detail below runs
               the full width of the card, which keeps the measure readable
               once the grid narrows to three columns. -->
          <div class="flex items-center gap-4" :class="{ 'mb-5': hasDetails(item) }">
            <!-- Flag Circle -->
            <div
              role="img"
              :aria-label="$t('languageFlagLabel', { language: item.name, code: item.bcp47.toUpperCase() })"
              class="w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-slate-700/50 bg-dark-900 flex items-center justify-center"
            >
              <!-- Every flag is 4:3, so an icon squared off at 56px is
                   letterboxed: the flag only covers the middle 56x42 and the
                   card background shows through top and bottom of the circle.
                   Scaling by 4/3 makes the short side match the circle; the
                   sides overflow and are cropped by the parent, so the flag
                   covers the whole disc. -->
              <Icon :name="item.flag" size="56px" aria-hidden="true" class="opacity-90 shrink-0 scale-[1.3334]" />
            </div>

            <h3 class="grow min-w-0 font-bold text-xl text-slate-100 font-display flex flex-wrap items-baseline gap-x-2">
              {{ item.name }}
              <span class="font-mono text-[11px] font-normal uppercase tracking-widest text-slate-400">
                {{ item.bcp47 }}
              </span>
            </h3>

            <!-- The level reads as text in every case: nothing here is carried
                 by colour alone. -->
            <span
              v-if="item.level === 'native'"
              class="shrink-0 text-xs font-bold px-2 py-1 rounded bg-dark-950/50 border border-primary-500/30 text-primary-400"
              :title="$t('languageLevelNativeAria')"
            >
              {{ $t('languageLevelNative') }}
            </span>
            <span
              v-else
              class="shrink-0 text-xs font-bold px-2 py-1 rounded bg-dark-950/50 border border-slate-700 text-secondary-400"
              :title="$t('languageLevelCefrAria', { level: item.level })"
            >
              {{ $t('languageCefr') }} {{ item.level }}
            </span>
          </div>

          <dl v-if="hasDetails(item)" class="space-y-3 text-sm">
            <div v-if="item.usage">
              <dt class="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {{ $t('languageUsageLabel') }}
              </dt>
              <dd class="text-slate-200 mt-1">{{ item.usage }}</dd>
            </div>

            <div v-if="item.evidence">
              <dt class="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {{ $t('languageEvidenceLabel') }}
              </dt>
              <dd class="text-slate-300 mt-1 leading-relaxed">{{ item.evidence }}</dd>
            </div>

            <div v-if="item.note">
              <dt class="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {{ $t('languageNoteLabel') }}
              </dt>
              <dd class="text-slate-300 mt-1 leading-relaxed">{{ item.note }}</dd>
            </div>

            <div v-if="item.certification">
              <dt class="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {{ $t('languageCertificationLabel') }}
              </dt>
              <dd class="mt-1">
                <!-- A language certificate is named in the language it
                     certifies, so the title is marked up as that language
                     rather than the page's — the page locale is inherited
                     everywhere else, because the rest of the card is
                     written in it. -->
                <span :lang="item.bcp47" class="text-slate-200">{{ item.certification.title }}</span>
                <!-- Issuer, year and link sit on their own line: wrapping
                     them inline leaves a separator dot orphaned at the
                     start of a line on narrow screens. -->
                <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-300">
                  <span>{{ item.certification.issuer }}</span>
                  <template v-if="item.certification.year">
                    <span class="w-1 h-1 rounded-full bg-slate-600" aria-hidden="true" />
                    <span>{{ item.certification.year }}</span>
                  </template>
                  <a
                    v-if="item.certification.url"
                    :href="item.certification.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs font-mono text-secondary-400 border border-secondary-500/30 px-2 py-1 rounded hover:bg-secondary-500/10 transition-colors flex items-center gap-1"
                  >
                    {{ $t('languageVerifyCertification') }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
                    <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
                  </a>
                </div>
              </dd>
            </div>
          </dl>
        </li>
      </ul>
    </div>

    <div v-else class="font-bold text-red-500 underline text-center">
      Please add language in app config
    </div>
  </div>
</template>
