<script lang="ts" setup>
const { awesome } = useAppConfig()
const { t } = useI18n()

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
</script>

<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-950/80 border-b border-gray-50/[0.2]">
    <div class="max-w-screen-2xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo/Title -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 font-bold text-lg text-primary-500 hover:text-primary-600 transition-colors"
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
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1 ml-4 border-l border-gray-700 pl-4">
            <a
              v-for="link in navLinks"
              :key="String(link.to)"
              :href="String(link.to)"
              class="px-3 py-2 text-sm font-medium text-gray-300 hover:text-primary-400 transition-colors"
            >
              {{ link.title }}
            </a>
            
            <!-- Social Links (Desktop) -->
            <div class="flex items-center gap-1 ml-2">
              <a
                v-for="social in socialLinks"
                :key="social.href"
                :href="social.href"
                :title="social.title"
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
            class="md:hidden p-2 text-gray-400 ml-2 rounded-lg hover:bg-gray-800 transition-colors"
            :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
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
      <div
        v-show="isMenuOpen"
        class="md:hidden border-t border-gray-50/[0.1] bg-gray-950/95 backdrop-blur-md"
      >
        <div class="max-w-screen-2xl mx-auto px-4 py-4 space-y-1">
          <!-- Nav Links -->
          <a
            v-for="link in navLinks"
            :key="String(link.to)"
            :href="String(link.to)"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-primary-500/10 hover:text-primary-400 transition-all"
            @click="closeMenu"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span>
            {{ link.title }}
          </a>

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
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
