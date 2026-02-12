<script lang="ts" setup>
const { awesome } = useAppConfig()
const { t } = useI18n()

// Simple navigation links from config
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
</script>

<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-900/10 dark:border-gray-50/[0.2]">
    <div class="max-w-screen-2xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo/Title -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 font-bold text-lg text-primary-500 hover:text-primary-600 transition-colors"
        >
          <Icon name="pixelarticons:users" class="text-xl" />
          <span class="capitalize">{{ awesome.name }}</span>
        </NuxtLink>

        <!-- Right Side: Controls & Navigation -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Always Visible Toggles -->
          <div class="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1 ml-4 border-l border-gray-300 dark:border-gray-700 pl-4">
            <a
              v-for="link in navLinks"
              :key="String(link.to)"
              :href="String(link.to)"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
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
                class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <Icon :name="social.icon" class="text-xl" />
              </a>
            </div>
          </nav>

          <!-- Mobile Menu Button (Toggle side menu - to be implemented) -->
          <button 
            class="md:hidden p-2 text-gray-600 dark:text-gray-400 ml-2"
            @click="$emit('toggle-mobile-menu')"
          >
            <Icon name="heroicons:bars-3-bottom-right-20-solid" class="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
