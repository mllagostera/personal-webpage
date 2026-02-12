<script lang="ts" setup>
const colorMode = useColorMode()

const themes = [
  { name: 'Light', key: 'light', icon: 'uil:sun' },
  { name: 'Dark', key: 'dark', icon: 'uil:moon' },
  { name: 'System', key: 'system', icon: 'uil:laptop' },
]

const currentTheme = computed(() => 
  themes.find(t => t.key === colorMode.preference) || themes[2]
)

const setTheme = (key: string) => {
  colorMode.preference = key
}
</script>

<template>
  <HeadlessListbox :model-value="colorMode.preference" @update:model-value="setTheme">
    <div class="relative">
      <HeadlessListboxButton
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="`Current theme: ${colorMode.preference}`"
      >
        <span class="flex justify-center items-center dark:hidden">
          <Icon name="uil:sun" class="text-xl text-gray-600" />
        </span>
        <span class="justify-center items-center hidden dark:flex">
          <Icon name="uil:moon" class="text-xl text-gray-400" />
        </span>
      </HeadlessListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessListboxOptions
          class="absolute right-0 mt-1 max-h-60 w-32 overflow-auto rounded-md bg-white dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-[60]"
        >
          <HeadlessListboxOption
            v-for="theme in themes"
            v-slot="{ active, selected }"
            :key="theme.key"
            :value="theme.key"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-100',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ theme.name }}
              </span>
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon :name="theme.icon" class="text-lg" />
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400"
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
