<script setup lang="ts">
const { locale, setLocale } = useI18n()

type LocaleCode = 'en' | 'es' | 'ca'

interface Language {
  name: string
  code: LocaleCode
  icon: string
}

const availableLanguages: Language[] = [
  { name: 'English', code: 'en', icon: 'flag:sh-4x3' },
  { name: 'Español', code: 'es', icon: 'flag:es-4x3' },
  { name: 'Català', code: 'ca', icon: 'flag:es-ct-4x3' },
]

const currentLanguage = computed(() => {
  const currentLocale = locale.value || 'en'
  const localeCode = String(currentLocale).split('-')[0]?.toLowerCase() || 'en'
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
        class="p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        :title="`Current language: ${currentLanguage.name}`"
      >
        <Icon :name="currentLanguage.icon" class="text-xl" />
        <span class="text-sm font-medium text-gray-400 hidden sm:inline">
          {{ currentLanguage.code.toUpperCase() }}
        </span>
        <Icon name="heroicons:chevron-down-20-solid" class="text-gray-400 text-xs" />
      </HeadlessListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessListboxOptions
          class="absolute right-0 mt-1 max-h-60 w-40 overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm z-[60]"
        >
          <HeadlessListboxOption
            v-for="lang in availableLanguages"
            v-slot="{ active, selected }"
            :key="lang.code"
            :value="lang.code"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-primary-900/20 text-primary-400' : 'text-gray-100',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ lang.name }}
              </span>
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon :name="lang.icon" class="text-lg" />
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-400"
              >
                <Icon name="heroicons:check-20-solid" class="text-lg" />
              </span>
            </li>
          </HeadlessListboxOption>
        </HeadlessListboxOptions>
      </transition>
    </div>
  </HeadlessListbox>
</template>
