<script setup lang="ts">
const { locale, setLocale } = useI18n()

type LocaleCode = 'en' | 'es' | 'ca'

interface Language {
  name: string
  code: LocaleCode
  icon: string
}

const availableLanguages: Language[] = [
  { name: 'Español', code: 'es', icon: 'flag:es-4x3' },
  { name: 'Català', code: 'ca', icon: 'flag:es-ct-4x3' },
  { name: 'English', code: 'en', icon: 'flag:gb-4x3' },
]

const currentLanguage = computed(() => {
  const currentLocale = locale.value || 'es'
  const localeCode = String(currentLocale).split('-')[0]?.toLowerCase() || 'es'
  return (availableLanguages.find(lang => lang.code === localeCode) || availableLanguages[0]) as Language
})

const setLanguage = async (code: LocaleCode) => {
  await setLocale(code)
}
</script>

<template>
  <HeadlessListbox :model-value="currentLanguage.code" @update:model-value="setLanguage">
    <div class="relative">
      <HeadlessListboxButton
        class="flex items-center gap-2 px-2.5 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-panel transition-colors"
        :title="$t('currentLanguage', { language: currentLanguage.name })"
        :aria-label="$t('currentLanguage', { language: currentLanguage.name })"
      >
        <Icon :name="currentLanguage.icon" class="text-base" aria-hidden="true" />
        <span aria-hidden="true">--lang=<span class="text-slate-200">{{ currentLanguage.code }}</span></span>
        <Icon name="heroicons:chevron-down-20-solid" class="text-xs" aria-hidden="true" />
      </HeadlessListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessListboxOptions
          class="absolute right-0 top-[calc(100%+6px)] w-44 p-1 rounded-lg bg-panel border border-line
                 shadow-[0_20px_40px_rgba(0,0,0,0.5)] focus:outline-none z-[60]"
        >
          <HeadlessListboxOption
            v-for="lang in availableLanguages"
            v-slot="{ active, selected }"
            :key="lang.code"
            :value="lang.code"
            as="template"
          >
            <li
              class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer select-none"
              :class="active ? 'bg-primary-500/10 text-primary-400' : selected ? 'text-slate-200' : 'text-slate-400'"
            >
              <Icon :name="lang.icon" class="text-base" aria-hidden="true" />
              <span class="flex-1 font-sans">{{ lang.name }}</span>
              <Icon v-if="selected" name="heroicons:check-20-solid" class="text-primary-400" aria-hidden="true" />
            </li>
          </HeadlessListboxOption>
        </HeadlessListboxOptions>
      </transition>
    </div>
  </HeadlessListbox>
</template>
