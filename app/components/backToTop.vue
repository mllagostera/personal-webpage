<script setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isVisible = computed(() => y.value > 200)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-10 opacity-0 scale-75"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-10 opacity-0 scale-75"
  >
    <button
      v-show="isVisible"
      @click="scrollToTop"
      aria-label="Volver arriba"
      title="Back to top"
      class="fixed bottom-6 right-6 z-50 group"
    >
      <!-- Inner wrapper provides the relative context for the glow ring -->
      <div class="relative w-12 h-12">
        <!-- Glow ring -->
        <span class="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-60 blur-md transition-all duration-300 scale-125"></span>
        <!-- Button body -->
        <span class="relative flex items-center justify-center w-12 h-12 rounded-full
                     bg-dark-900/70 backdrop-blur-md
                     border border-white/10 group-hover:border-primary-500/60
                     shadow-xl transition-all duration-300 group-hover:scale-110">
          <Icon 
            name="heroicons:chevron-up-20-solid" 
            class="w-6 h-6 text-secondary-400 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-300" 
          />
        </span>
      </div>
    </button>
  </Transition>
</template>