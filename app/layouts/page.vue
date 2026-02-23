<template>
  <div class="overflow-x-hidden min-h-screen flex flex-col bg-gray-950 transition-colors duration-300">
    <TheNavbar />
    <main class="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-8">
      <slot />
    </main>
    <footer class="py-6 border-t border-gray-50/[0.2] text-center text-sm text-gray-500">
      <div class="max-w-screen-2xl mx-auto px-4">
        &copy; {{ new Date().getFullYear() }} {{ awesome.name }}. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { awesome } = useAppConfig()
</script>
