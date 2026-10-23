<script setup lang="ts">
// #region [Data]

import type { Language } from "~/utils/curriculumVitae";

const { tm, rt } = useI18n()

/** Optional strings come back from `tm()` as message objects, or missing. */
const text = (value: unknown) => (value ? rt(value as string) : '')

/** The CEFR bands in order: the meter has one segment per band. */
const CEFR_BANDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

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

    const level = text(l.level)
    const isNative = level === 'native'

    return {
      name: text(l.name),
      bcp47: text(l.bcp47),
      level,
      isNative,
      // A mother tongue sits past the top of the scale, so it fills it.
      filled: isNative ? CEFR_BANDS.length : CEFR_BANDS.indexOf(level as typeof CEFR_BANDS[number]) + 1,
      usage: text(l.usage),
      certification,
    }
  }) : []
})
// #endregion
</script>
<template>
  <section>
    <div v-if="languages.length">
      <SectionHeading icon="heroicons:language" heading-id="languages-heading" class="mb-8">{{ $t('languages') }}</SectionHeading>

      <!-- One row per language rather than one card each: the entries carry
           very different amounts of detail, and equal-height cards turned that
           difference into empty boxes. In a list a short entry is just a short
           row. The level meter is in the same column on every row, so levels
           compare at a glance. -->
      <ul
        class="glass-card px-6 md:px-8 py-2 divide-y divide-white/5 list-none"
        aria-labelledby="languages-heading"
      >
        <li
          v-for="item in languages"
          :key="item.bcp47"
          class="grid grid-cols-[1fr_auto] md:grid-cols-[11rem_13rem_1fr] gap-x-8 gap-y-3 py-6 items-start"
        >
          <h3 class="font-display font-bold text-xl text-slate-100 flex items-baseline gap-2">
            {{ item.name }}
            <span class="font-mono text-[11px] font-normal uppercase tracking-widest text-slate-400">{{ item.bcp47 }}</span>
          </h3>

          <!-- The level is stated as text; the meter only illustrates it, so
               it is hidden from assistive technology. -->
          <div class="w-36 md:w-full">
            <div class="flex items-baseline justify-between gap-3 mb-2">
              <span
                class="font-display font-bold text-lg leading-none"
                :class="item.isNative ? 'text-primary-400' : 'text-white'"
                aria-hidden="true"
              >
                {{ item.isNative ? $t('languageLevelNative') : item.level }}
              </span>
              <span class="sr-only">
                {{ item.isNative ? $t('languageLevelNativeAria') : $t('languageLevelCefrAria', { level: item.level }) }}
              </span>
              <span v-if="!item.isNative" class="text-[10px] font-bold uppercase tracking-widest text-slate-400" aria-hidden="true">
                {{ $t('languageCefr') }}
              </span>
            </div>
            <div class="flex gap-1" aria-hidden="true">
              <span
                v-for="n in 6"
                :key="n"
                class="h-1.5 flex-1 rounded-full"
                :class="n <= item.filled ? 'bg-primary-500' : 'bg-white/15'"
              />
            </div>
            <div class="flex justify-between mt-1.5 font-mono text-[10px] text-slate-500" aria-hidden="true">
              <span>A1</span><span>C2</span>
            </div>
          </div>

          <div
            v-if="item.usage || item.certification"
            class="col-span-2 md:col-span-1 space-y-2 text-sm leading-relaxed max-w-prose"
          >
            <p v-if="item.usage" class="text-slate-300">{{ item.usage }}</p>

            <!-- Title on its own line, issuer and year beneath: run inline,
                 a separator dot ends up orphaned at the start of a line on
                 narrow screens. -->
            <div v-if="item.certification" class="flex items-start gap-2">
              <Icon name="heroicons:check-badge" class="text-lg text-primary-400 shrink-0 mt-px" aria-hidden="true" />
              <div>
                <span class="sr-only">{{ $t('languageCertificationLabel') }}:</span>
                <!-- A language certificate is named in the language it
                     certifies, so the title is marked up as that language. -->
                <span :lang="item.bcp47" class="text-slate-200 font-medium">{{ item.certification.title }}</span>
                <div class="flex flex-wrap items-center gap-x-2 text-slate-400">
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
                    class="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 underline-offset-2 hover:underline"
                  >
                    {{ $t('languageVerifyCertification') }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
                    <Icon name="heroicons:arrow-top-right-on-square" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="font-bold text-red-500 underline text-center">
      Please add language in app config
    </div>
  </section>
</template>
