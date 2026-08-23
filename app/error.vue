<script lang="ts" setup>
import type { NuxtError } from '#app'
import { ERROR_404_TITLE, ERROR_GENERIC_TITLE } from '~~/shared/site'

// Nuxt renders this component instead of `app.vue` for every unhandled error,
// on the server and on the client, so anything app.vue provides has to be
// repeated here — hence the contact modal below, which the navbar button opens.
const props = defineProps<{ error: NuxtError }>()

const { isContactModalOpen, closeContactModal, restoreContactModalFocus } = useContactModal()
const { locale } = useI18n()

const statusCode = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)

// The big numerals, with the middle one in the accent colour. Driven by the
// status code rather than hardcoded, so a 500 gets the same treatment.
const codeDigits = computed(() => String(statusCode.value).split(''))
const accentDigit = computed(() => Math.floor(codeDigits.value.length / 2))

// Nuxt puts the failing URL on the error payload; `useRoute()` is the fallback
// for client-side errors, where the payload is built without it. Truncated
// because a long URL would otherwise stretch the line past the layout.
const route = useRoute()
const requestedPath = computed(() => {
  const url = (props.error as NuxtError & { url?: string })?.url || route.fullPath
  return url.length > 64 ? `${url.slice(0, 64)}…` : url
})

const backHome = async (event: MouseEvent) => {
  // Modifier clicks and middle clicks are the browser's to handle: this stays a
  // real link so it can be opened in a new tab.
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  await clearError({ redirect: '/' })
}

// #region [Starfield]
// Ambient background. Canvas rather than hundreds of DOM nodes, and it only
// exists on the client — the page is fully readable without it.
interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
}

const starfield = useTemplateRef<HTMLCanvasElement>('starfield')
const { width, height } = useElementSize(starfield)
const reducedMotion = usePreferredReducedMotion()
const documentVisibility = useDocumentVisibility()

let context: CanvasRenderingContext2D | null = null
let stars: Star[] = []

const seed = (w: number, h: number) => {
  const count = Math.round((w * h) / 9000)
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.1 + 0.25,
    alpha: Math.random() * 0.5 + 0.25,
    // Bigger stars drift faster, which reads as parallax rather than a
    // uniformly sliding texture.
    speed: Math.random() * 0.05 + 0.01,
  }))
}

const paint = () => {
  if (!context) return
  context.clearRect(0, 0, width.value, height.value)
  for (const star of stars) {
    context.globalAlpha = star.alpha
    context.fillStyle = star.radius > 0.9 ? '#d1fae5' : '#ffffff'
    context.beginPath()
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1
}

const step = () => {
  for (const star of stars) {
    star.x -= star.speed
    if (star.x < -2) {
      star.x = width.value + 2
      star.y = Math.random() * height.value
    }
  }
  paint()
}

const { pause, resume } = useRafFn(step, { immediate: false })

watch([width, height], ([w, h]) => {
  const canvas = starfield.value
  if (!canvas || !w || !h) return

  // Capped at 2: beyond that the extra pixels cost more than they show.
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)

  context = canvas.getContext('2d')
  context?.setTransform(dpr, 0, 0, dpr, 0, 0)

  seed(w, h)
  paint()
})

// Motionless — but still visible — when the reader asked for reduced motion,
// and paused outright while the tab is in the background.
watch([reducedMotion, documentVisibility], ([motion, visibility]) => {
  if (motion === 'reduce' || visibility === 'hidden') pause()
  else resume()
}, { immediate: true })
// #endregion

useHead({
  htmlAttrs: {
    lang: locale,
  },
  meta: [
    { name: 'theme-color', content: '#020617' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})

// An error page must never be indexed, whatever status brought the reader here.
// `follow` so the links out of it still pass crawlers back to the real pages.
useSeoMeta({
  title: isNotFound.value ? ERROR_404_TITLE : ERROR_GENERIC_TITLE,
  robots: 'noindex, follow',
})
</script>

<template>
  <NuxtLayout name="page">
    <!-- `app.vue` does not render on an error, so the navigation feedback it
         provides has to be repeated here: leaving this page is a real
         navigation, and it can land on a cold Lambda like any other. -->
    <TheRouteLoader />

    <div class="relative isolate mx-auto w-full overflow-x-hidden px-4 2xl:px-0">
      <canvas ref="starfield" class="starfield" aria-hidden="true" />
      <div class="saber-glow" aria-hidden="true" />

      <div class="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center animate-fade-in-up">
        <!-- Tighter on narrow screens so the label stays on one line: wrapped,
             it leaves the beacon stranded on the left of the first line. -->
        <p
          class="mb-6 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em]
                 text-primary-400 sm:text-xs sm:tracking-[0.28em]"
        >
          <span class="beacon" aria-hidden="true" />
          <span class="text-center">{{ $t('errorEyebrow', { code: statusCode }) }}</span>
        </p>

        <h1 class="error-code font-display font-extrabold uppercase text-white">
          <span
            v-for="(digit, index) in codeDigits"
            :key="index"
            :class="index === accentDigit ? 'accent-digit' : ''"
          >{{ digit }}</span>
        </h1>

        <!-- Decorative: the heading above already carries the status code. -->
        <div class="saber" aria-hidden="true">
          <span class="hilt" />
          <span class="beam" />
        </div>

        <template v-if="isNotFound">
          <p class="max-w-[20ch] font-display text-2xl font-light leading-tight text-white md:text-4xl">
            {{ $t('errorQuote') }}
          </p>
          <p class="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
            {{ $t('errorQuoteAttribution') }}
          </p>
          <p class="mt-7 max-w-[58ch] text-lg leading-relaxed text-slate-300">
            {{ $t('errorNotFoundDescription') }}
          </p>
        </template>

        <template v-else>
          <p class="max-w-[20ch] font-display text-2xl font-light leading-tight text-white md:text-4xl">
            {{ $t('errorGenericTitle') }}
          </p>
          <p class="mt-7 max-w-[58ch] text-lg leading-relaxed text-slate-300">
            {{ $t('errorGenericDescription') }}
          </p>
        </template>

        <p
          class="mt-6 inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-dark-900/55
                 px-3 py-2 font-mono text-xs text-gray-400"
        >
          <span class="text-primary-400">{{ $t('errorRequestedPath') }}</span>
          <span class="break-all text-white">{{ requestedPath }}</span>
        </p>

        <a
          href="/"
          class="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold
                 text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-95
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
          @click="backHome"
        >
          <Icon name="heroicons:home" class="h-5 w-5" />
          {{ $t('errorBackHome') }}
        </a>
      </div>
    </div>

    <!-- Same global contact modal as app.vue: the navbar button in the layout
         opens it, and app.vue is not rendered on the error page. -->
    <LazyContactModal
      :is-open="isContactModalOpen"
      @close="closeContactModal"
      @closed="restoreContactModalFocus"
    >
      <LazyContactFormContent />
    </LazyContactModal>
  </NuxtLayout>
</template>

<style scoped>
.starfield {
  position: absolute;
  inset: 0;
  z-index: -10;
  display: block;
  width: 100%;
  height: 100%;
}

/* Emerald halo under the saber, tying the numerals and the beam together. */
.saber-glow {
  position: absolute;
  z-index: -10;
  top: 45%;
  left: 50%;
  width: min(80vw, 900px);
  height: 320px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.16) 0%, transparent 70%);
  pointer-events: none;
}

.beacon {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background: var(--color-primary-400);
  box-shadow: 0 0 8px var(--color-primary-400);
  animation: beacon-blink 2.4s ease-in-out infinite;
}

@keyframes beacon-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.error-code {
  font-size: clamp(5.5rem, 21vw, 15rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  text-shadow: 0 0 60px rgba(16, 185, 129, 0.28);
}

.accent-digit {
  color: var(--color-primary-400);
  text-shadow: 0 0 12px rgba(52, 211, 153, 0.55), 0 0 48px rgba(16, 185, 129, 0.35);
}

/* Lightsaber divider. The site accent is already emerald, so the blade is the
   one flourish that reads as Star Wars without borrowing any of its assets. */
.saber {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(680px, 92%);
  margin: clamp(1.5rem, 4vw, 2.5rem) auto;
}

.hilt {
  position: relative;
  flex: 0 0 auto;
  width: 46px;
  height: 13px;
  border: 1px solid #6b7280;
  border-radius: 3px;
  background: linear-gradient(180deg, #9ca3af 0%, #4b5563 45%, #1f2937 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.hilt::before,
.hilt::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.hilt::before { left: 12px; width: 2px; }
.hilt::after { left: 24px; width: 3px; }

.beam {
  flex: 1 1 auto;
  height: 5px;
  border-radius: 9999px;
  background: #f0fff8;
  box-shadow:
    0 0 6px 1px rgba(52, 211, 153, 0.95),
    0 0 18px 4px rgba(16, 185, 129, 0.65),
    0 0 42px 10px rgba(16, 185, 129, 0.28);
  transform-origin: left center;
  animation: saber-ignite 900ms cubic-bezier(0.16, 1.08, 0.38, 0.98) 250ms both;
}

@keyframes saber-ignite {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}

/* The global reduced-motion rule shortens every animation to 0.01ms. That is
   the right end state here — the blade is lit, it just never sweeps. */
@media (prefers-reduced-motion: reduce) {
  .beam {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>
