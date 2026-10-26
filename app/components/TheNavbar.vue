<script lang="ts" setup>
const { awesome } = useAppConfig()
const { t, locale } = useI18n()
const route = useRoute()

const isMenuOpen = ref(false)

// Shell-style relative paths: `./experiencia`, `./projects`.
const navLinks = computed(() =>
  (awesome?.layout?.page?.navbar?.menus || []).map(item => ({
    label: `./${t(String(item.title || '')).toLocaleLowerCase(locale.value)}`,
    to: String(item.to || '/'),
  })),
)

// A case study lives under /projects, so its parent stays lit while it is open.
const isCurrent = (to: string) => route.path === to || (to !== '/' && route.path.startsWith(`${to}/`))
const ariaCurrent = (to: string) => (route.path === to ? 'page' : isCurrent(to) ? 'true' : undefined)

// The logo doubles as the working directory: `~/mllagostera/experience`.
const pathLabel = computed(() => (route.path === '/' ? '' : route.path))

const closeMenu = () => { isMenuOpen.value = false }

watch(() => route.path, closeMenu)

const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')

// Escape closes the drawer and hands focus back to the button that opened it,
// which is otherwise left behind wherever the user happened to be.
const onMenuEscape = () => {
  if (!isMenuOpen.value) return
  closeMenu()
  nextTick(() => menuButton.value?.focus())
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-ink-950/85 backdrop-blur-md border-b border-line"
    @keydown.esc="onMenuEscape"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4 text-[13px]">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 min-w-0 font-bold text-primary-400 hover:text-primary-300 transition-colors"
        :aria-label="$t('homeLinkLabel', { name: awesome.name })"
      >
        <span class="size-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
        <span class="truncate">~/mllagostera<span class="font-normal text-muted">{{ pathLabel }}</span></span>
      </NuxtLink>

      <div class="flex items-center gap-1.5 shrink-0">
        <nav :aria-label="$t('mainNavigation')" class="hidden md:flex items-center gap-1.5">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :aria-current="ariaCurrent(link.to)"
            class="px-2.5 py-2 rounded-md hover:text-primary-400 hover:bg-panel transition-colors"
            :class="isCurrent(link.to) ? 'text-primary-400' : 'text-slate-400'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="md:ml-2 md:pl-3.5 md:border-l border-line">
          <LanguageSelector />
        </div>

        <button
          ref="menuButton"
          type="button"
          class="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-panel transition-colors"
          :aria-label="isMenuOpen ? $t('closeMenu') : $t('openMenu')"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Icon
            :name="isMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-bottom-right-20-solid'"
            class="text-xl"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <!-- A real nav landmark: the desktop one is display:none at this width,
           so without this the drawer's links sit outside any landmark. -->
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        :aria-label="$t('mainNavigation')"
        class="md:hidden border-t border-line bg-ink-950/95"
      >
        <ul class="max-w-7xl mx-auto px-4 py-3 space-y-1 text-sm">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              :aria-current="ariaCurrent(link.to)"
              class="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-panel hover:text-primary-400 transition-colors"
              :class="isCurrent(link.to) ? 'text-primary-400 bg-panel' : 'text-slate-300'"
              @click="closeMenu"
            >
              <span class="text-muted" aria-hidden="true">$ cd</span>
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
