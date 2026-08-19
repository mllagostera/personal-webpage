<template>
  <div class="overflow-x-hidden min-h-screen flex flex-col bg-gray-950 transition-colors duration-300">
    <!-- Eleven stops separate the top of the document from the content: logo,
         language selector, contact button, four nav links and four social
         icons. Hidden until focused. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70]
             focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-700 focus:text-white
             focus:text-sm focus:font-bold
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
    >
      {{ $t('skipToContent') }}
    </a>
    <TheNavbar />
    <main id="main" tabindex="-1" class="flex-1 max-w-screen-2xl mx-auto w-full px-4 pt-20 pb-8 focus:outline-none">
      <slot />
    </main>
    <footer class="py-6 border-t border-gray-50/[0.2] text-center text-sm text-gray-400">
      <div class="max-w-screen-2xl mx-auto px-4">
        &copy; {{ new Date().getFullYear() }} {{ awesome.name }}. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { awesome } = useAppConfig()
</script>
