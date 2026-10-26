<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isVisible = computed(() => y.value > 200)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })

  // Move focus along with the viewport. Without this the button scrolls the page
  // and then hides itself, dropping focus to <body> and sending the next Tab
  // back to wherever the reader already was.
  //
  // Deferred a frame because the click re-focuses the button after the handler
  // returns, which would undo it. `preventScroll` leaves the smooth scroll above
  // to do the moving.
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true })
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
      :aria-label="$t('backToTop')"
      class="fixed bottom-6 right-6 z-50 group grid place-items-center size-11 rounded-lg
             bg-panel/90 backdrop-blur-md border border-line hover:border-primary-500
             shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-colors"
      @click="scrollToTop"
    >
      <Icon
        name="heroicons:chevron-up-20-solid"
        class="text-2xl text-primary-400 group-hover:-translate-y-0.5 transition-transform"
        aria-hidden="true"
      />
    </button>
  </Transition>
</template>