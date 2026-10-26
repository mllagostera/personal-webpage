<template>
  <div class="overflow-x-clip min-h-screen flex flex-col bg-ink-950 text-slate-300 font-mono">
    <!-- `overflow-x-clip` above, not `hidden`: hidden turns the wrapper into a
         scroll container, and the sticky navbar would stick to it instead of
         the viewport — that is, never. -->
    <!-- Hidden until focused: the logo, the language selector and four nav
         links stand between the top of the document and the content. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[70]
             focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-primary-700 focus:text-white
             focus:font-sans focus:text-sm focus:font-bold"
    >
      {{ $t('skipToContent') }}
    </a>
    <TheNavbar />
    <main id="main" tabindex="-1" class="flex-1 w-full max-w-7xl mx-auto focus:outline-none">
      <slot />
    </main>
    <!-- Right padding keeps the last link clear of the back-to-top button,
         which is fixed over this corner once the page has scrolled. -->
    <footer class="border-t border-line">
      <div class="max-w-7xl mx-auto pl-4 sm:pl-8 pr-20 py-5 flex flex-wrap justify-between gap-3 text-xs text-muted">
        <span>exit 0 · &copy; {{ new Date().getFullYear() }} {{ awesome.name }}</span>
        <ul class="flex flex-wrap gap-3">
          <li v-for="social in socialLinks" :key="social.href">
            <a
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-400 transition-colors"
            >
              {{ social.label.toLowerCase() }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { awesome } = useAppConfig()
const socialLinks = useSocialLinks()
</script>
