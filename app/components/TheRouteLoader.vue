<script lang="ts" setup>
/**
 * Navigation feedback, in two layers: a progress bar from the first moment, and
 * a full-screen overlay once the wait drags on.
 *
 * The site is server-rendered on Amplify compute: a request that lands on a
 * cold Lambda takes seconds to answer, and a client-side navigation to a page
 * that awaits `/api/*` inherits that wait. Until it resolves, Vue keeps the
 * *previous* page on screen — without this the site looks frozen, as if the
 * click had been ignored.
 *
 * It stays hidden until a navigation has outlived `VISIBLE_AFTER`, so the warm
 * case — every navigation once the Lambda is up — never flashes it.
 */

// Below this a navigation is quick enough that announcing it is just noise;
// `<NuxtLoadingIndicator>` already covers that range with its progress bar.
const VISIBLE_AFTER = 600
// Past this the wait is a cold start rather than a slow page, and saying so
// beats leaving the reader to guess whether the site is broken.
const COLD_START_AFTER = 2500
// Nothing should keep the overlay up this long. If a hook never fires, the
// page must not be left behind a backdrop that never lifts.
const GIVE_UP_AFTER = 30_000

const isVisible = ref(false)
const isColdStart = ref(false)

let timers: ReturnType<typeof setTimeout>[] = []

const stop = () => {
  timers.forEach(clearTimeout)
  timers = []
  isVisible.value = false
  isColdStart.value = false
}

const start = () => {
  stop()
  timers = [
    setTimeout(() => { isVisible.value = true }, VISIBLE_AFTER),
    setTimeout(() => { isColdStart.value = true }, COLD_START_AFTER),
    setTimeout(stop, GIVE_UP_AFTER),
  ]
}

// The bar's default curve reaches 100% in two seconds and then sits there,
// which on a cold start reads as "stuck at the end". This one decelerates
// instead: it keeps creeping for as long as the request is in flight and never
// quite arrives.
const estimatedProgress = (duration: number, elapsed: number) => 100 * (1 - Math.exp(-elapsed / duration))

const nuxtApp = useNuxtApp()
let unsubscribe: (() => void)[] = []

// Registered on mount, so the server render does not subscribe to hooks it can
// never unsubscribe from. Hydration happens long before the first click, so no
// navigation goes unnoticed.
onMounted(() => {
  // The same pair `<NuxtLoadingIndicator>` listens to: they bracket the whole
  // navigation, the async data a page awaits in `setup` included. `app:error`
  // is the escape hatch — a navigation that throws never reaches `:end`, and
  // the error page would otherwise render under an overlay that never lifts.
  unsubscribe = [
    nuxtApp.hook('page:loading:start', start),
    nuxtApp.hook('page:loading:end', stop),
    nuxtApp.hook('app:error', stop),
  ]
})

onBeforeUnmount(() => {
  unsubscribe.forEach((off) => off())
  unsubscribe = []
  stop()
})
</script>

<template>
  <NuxtLoadingIndicator
    :height="3"
    :duration="3000"
    :estimated-progress="estimatedProgress"
    color="repeating-linear-gradient(to right, #065f46 0%, #10b981 50%, #34d399 100%)"
  />

  <Transition name="route-loader">
    <!-- Above the navbar (z-50), below the contact modal (z-60). Clicks pass
         through: a navigation is already in flight, and swallowing input would
         only make the page feel more stuck if this ever outlived the request. -->
    <div
      v-if="isVisible"
      class="pointer-events-none fixed inset-0 z-[55] flex flex-col items-center justify-center gap-5
             bg-gray-950/80 px-6 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span class="route-loader-ring" aria-hidden="true" />

      <p class="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
        {{ $t('loading') }}
      </p>

      <Transition name="route-loader">
        <p v-if="isColdStart" class="max-w-[38ch] text-center text-xs leading-relaxed text-gray-400">
          {{ $t('loadingColdStart') }}
        </p>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* A ring rather than a dot animation: the reduced-motion rule in main.css
   collapses every animation to a single 0.01ms pass, and a ring frozen at the
   end of its spin still looks exactly like a ring. */
.route-loader-ring {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255 / 0.1);
  border-top-color: var(--color-primary-400);
  box-shadow: 0 0 24px rgb(16 185 129 / 0.15);
  animation: route-loader-spin 900ms linear infinite;
}

@keyframes route-loader-spin {
  to {
    transform: rotate(360deg);
  }
}

.route-loader-enter-active,
.route-loader-leave-active {
  transition: opacity 0.25s ease;
}

.route-loader-enter-from,
.route-loader-leave-to {
  opacity: 0;
}
</style>
