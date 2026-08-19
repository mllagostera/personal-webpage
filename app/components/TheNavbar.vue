<script lang="ts" setup>
const { awesome } = useAppConfig()
const { t } = useI18n()
const { openContactModal } = useContactModal()

const isMenuOpen = ref(false)

const navLinks = computed(() => 
  (awesome?.layout?.page?.navbar?.menus || []).map(item => ({
    title: t(String(item.title || '')),
    to: item.to
  }))
)

const socialLinks = computed(() => [
  { href: awesome?.project?.links?.github, icon: 'mdi:github-face', title: 'GitHub' },
  { href: awesome?.project?.links?.linkedin, icon: 'mdi:linkedin', title: 'LinkedIn' },
  { href: awesome?.project?.links?.x, icon: 'mdi:twitter', title: 'Twitter' },
  { href: awesome?.project?.links?.stackshare, icon: 'mdi:stack-exchange', title: 'StackShare' },
].filter(link => link.href))

const closeMenu = () => { isMenuOpen.value = false }

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
    class="fixed top-0 z-50 w-full backdrop-blur-md bg-gray-950/80 border-b border-gray-50/[0.2]"
    @keydown.esc="onMenuEscape"
  >
    <div class="max-w-screen-2xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo/Title -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 font-bold text-lg text-primary-500 hover:text-primary-400 transition-colors"
          @click="closeMenu"
        >
          <Icon name="pixelarticons:users" class="text-xl" />
          <span class="capitalize">{{ awesome.name }}</span>
        </NuxtLink>

        <!-- Right Side: Controls & Navigation -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Always Visible Toggles -->
          <div class="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            
            <!-- Contact Button (Desktop context) -->
            <button 
              class="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-500/20"
              @click="openContactModal"
            >
              <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
              <span>{{ $t('contactTitle') || 'Contact' }}</span>
            </button>
          </div>

          <!-- Desktop Navigation Links -->
          <nav :aria-label="$t('mainNavigation')" class="hidden md:flex items-center gap-1 ml-4 border-l border-gray-700 pl-4">
            <NuxtLink
              v-for="link in navLinks"
              :key="String(link.to)"
              :to="link.to"
              class="px-3 py-2 text-sm font-medium text-gray-300 hover:text-primary-400 transition-colors"
              active-class="text-primary-400"
            >
              {{ link.title }}
            </NuxtLink>
            
            <!-- Social Links (Desktop) -->
            <div class="flex items-center gap-1 ml-2">
              <!-- Icon only, so the accessible name has to be spelled out:
                   `title` alone never surfaces on keyboard or touch. -->
              <a
                v-for="social in socialLinks"
                :key="social.href"
                :href="social.href"
                :title="social.title"
                :aria-label="`${social.title} (${$t('opensInNewWindow')})`"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Icon :name="social.icon" class="text-xl" />
              </a>
            </div>
          </nav>

          <!-- Mobile Menu Toggle -->
          <button
            ref="menuButton"
            class="md:hidden p-2 text-gray-400 ml-2 rounded-lg hover:bg-gray-800 transition-colors"
            :aria-label="isMenuOpen ? $t('closeMenu') : $t('openMenu')"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <Icon 
              :name="isMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-bottom-right-20-solid'" 
              class="text-2xl transition-transform duration-200"
              :class="{ 'rotate-90': isMenuOpen }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <!-- A real nav landmark: the desktop one is display:none at this width,
           so without this the drawer's links sit outside any landmark. -->
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        :aria-label="$t('mainNavigation')"
        class="md:hidden border-t border-gray-50/[0.1] bg-gray-950/95 backdrop-blur-md"
      >
        <div class="max-w-screen-2xl mx-auto px-4 py-4 space-y-1">
          <!-- Nav Links -->
          <NuxtLink
            v-for="link in navLinks"
            :key="String(link.to)"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-primary-500/10 hover:text-primary-400 transition-all"
            active-class="text-primary-400 bg-primary-500/10"
            @click="closeMenu"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"/>
            {{ link.title }}
          </NuxtLink>

          <!-- Contact Button Mobile Drawer -->
          <button 
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 transition-all"
            @click="() => { openContactModal(); closeMenu(); }"
          >
            <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
            {{ $t('contactTitle') || 'Contact' }}
          </button>

          <!-- Social Links -->
          <div v-if="socialLinks.length" class="pt-3 mt-3 border-t border-gray-800 flex items-center gap-2 flex-wrap px-2">
            <a
              v-for="social in socialLinks"
              :key="social.href"
              :href="social.href"
              :title="social.title"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
              @click="closeMenu"
            >
              <Icon :name="social.icon" class="text-xl" />
              <span>{{ social.title }}</span>
              <span class="sr-only">({{ $t('opensInNewWindow') }})</span>
            </a>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>
