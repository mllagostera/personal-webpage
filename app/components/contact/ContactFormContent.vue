<script setup lang="ts">
import type { FetchError } from 'ofetch'

const { t } = useI18n()

// Unique per instance: /contact renders this component inline *and* the global
// modal renders a second copy, so hard-coded ids would collide and every
// `<label for>` in the modal would resolve to the field behind it.
const uid = useId()
const nameId = `${uid}-name`
const emailId = `${uid}-email`
const messageId = `${uid}-message`
const messageHintId = `${uid}-message-hint`
const messageCounterId = `${uid}-message-counter`
const honeypotId = `${uid}-hp`

const form = reactive({
  name: '',
  email: '',
  message: '',
  _honey: '',          // honeypot — hidden from real users
  _timestamp: 0,       // set on mount, checked server-side
})

onMounted(() => {
  form._timestamp = Date.now()
})

const status = ref<'idle' | 'sending' | 'success' | 'error' | 'ratelimit'>('idle')
const errorMsg = ref('')

// `/api/contact` runs on Amplify compute, so the first submission after a quiet
// spell waits on a cold Lambda. The spinner alone doesn't say whether anything
// is happening; past this the wait gets an explanation instead.
const SLOW_SUBMIT_AFTER = 2500
const isSlowSubmit = ref(false)
let slowSubmitTimer: ReturnType<typeof setTimeout> | undefined

const clearSlowSubmit = () => {
  clearTimeout(slowSubmitTimer)
  slowSubmitTimer = undefined
  isSlowSubmit.value = false
}

onBeforeUnmount(clearSlowSubmit)

// On success the whole form — including the button that had focus — is removed
// from the DOM, which drops focus back to <body>. Move it to the confirmation
// heading instead, so the outcome is both announced and reachable.
const successHeading = useTemplateRef<HTMLElement>('successHeading')

watch(status, async (value) => {
  if (value !== 'success') return
  await nextTick()
  successHeading.value?.focus()
})

async function submit() {
  if (status.value === 'sending') return
  status.value = 'sending'
  errorMsg.value = ''
  clearSlowSubmit()
  slowSubmitTimer = setTimeout(() => { isSlowSubmit.value = true }, SLOW_SUBMIT_AFTER)

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        _honey: form._honey,
        _timestamp: form._timestamp,
      },
    })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
    form._timestamp = Date.now()
  } catch (err) {
    const fetchErr = err as FetchError
    const code = fetchErr?.response?.status ?? fetchErr?.statusCode
    if (code === 429) {
      status.value = 'ratelimit'
    } else {
      status.value = 'error'
      errorMsg.value = fetchErr?.data?.statusMessage ?? t('contactErrorGeneric')
    }
  } finally {
    clearSlowSubmit()
  }
}
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Success state -->
    <Transition name="fade">
      <div
        v-if="status === 'success'"
        role="status"
        class="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div class="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Icon name="heroicons:check-badge" class="w-8 h-8 text-emerald-400" />
        </div>
        <h3
          ref="successHeading"
          tabindex="-1"
          class="text-xl font-bold text-slate-100 font-display transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
        >{{ $t('contactSuccessTitle') }}</h3>
        <p class="text-slate-400 text-sm">{{ $t('contactSuccessBody') }}</p>
        <button
          class="mt-2 text-xs text-slate-400 hover:text-slate-200 transition-colors underline underline-offset-2"
          @click="status = 'idle'"
        >
          {{ $t('contactSendAnother') }}
        </button>
      </div>
    </Transition>

    <!-- Form -->
    <form v-if="status !== 'success'" class="space-y-6 relative z-10" @submit.prevent="submit">
      <div class="mb-6">
        <h3 class="text-2xl font-display font-bold text-white mb-2">{{ $t('contactTitle') }}</h3>
        <p class="text-slate-400 text-sm italic">{{ $t('contactSubtitle', 'Me encantaría saber de ti. Envíame un mensaje y te responderé lo antes posible.') }}</p>
      </div>

      <!-- Honeypot — visually hidden, never shown to humans -->
      <div aria-hidden="true" class="absolute opacity-0 pointer-events-none -top-[9999px] -left-[9999px]" tabindex="-1">
        <label :for="honeypotId">H-Field</label>
        <input
          :id="honeypotId"
          v-model="form._honey"
          type="text" 
          name="contact_hp_field" 
          autocomplete="new-password" 
          tabindex="-1" 
        >
      </div>

      <!-- Name -->
      <div class="space-y-2">
        <label :for="nameId" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactName') }}
        </label>
        <input
          :id="nameId"
          v-model="form.name"
          type="text"
          name="name"
          required
          minlength="2"
          maxlength="100"
          autocomplete="name"
          :placeholder="$t('contactNamePlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400
                 text-sm focus:border-primary-500/70 transition-all
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
        >
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label :for="emailId" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactEmail') }}
        </label>
        <input
          :id="emailId"
          v-model="form.email"
          type="email"
          name="email"
          required
          maxlength="200"
          autocomplete="email"
          :placeholder="$t('contactEmailPlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400
                 text-sm focus:border-primary-500/70 transition-all
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
        >
      </div>

      <!-- Message -->
      <div class="space-y-2">
        <label :for="messageId" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactMessage') }}
        </label>
        <textarea
          :id="messageId"
          v-model="form.message"
          :aria-describedby="`${messageHintId} ${messageCounterId}`"
          name="message"
          required
          minlength="10"
          maxlength="2000"
          rows="5"
          :placeholder="$t('contactMessagePlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400
                 text-sm focus:border-primary-500/70 transition-all resize-none
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
        />
        <!-- Announced when the field takes focus. The bounds are spelled out for
             anyone who cannot see the counter; the browser otherwise only
             mentions them once it has already rejected the submission. -->
        <p :id="messageHintId" class="sr-only">{{ $t('contactMessageHint') }}</p>
        <p :id="messageCounterId" class="text-right text-xs text-slate-400">{{ form.message.length }} / 2000</p>
      </div>

      <!-- Rate limit / error feedback -->
      <Transition name="fade">
        <div
          v-if="status === 'ratelimit'"
          role="alert"
          class="flex items-center gap-2 text-amber-400 bg-amber-950/40 border border-amber-700/30 rounded-lg px-4 py-3 text-sm"
        >
          <Icon name="heroicons:clock" class="w-4 h-4 shrink-0" />
          {{ $t('contactRateLimit') }}
        </div>
        <div
          v-else-if="status === 'error'"
          role="alert"
          class="flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-700/30 rounded-lg px-4 py-3 text-sm"
        >
          <Icon name="heroicons:exclamation-circle" class="w-4 h-4 shrink-0" />
          {{ errorMsg || $t('contactErrorGeneric') }}
        </div>
      </Transition>

      <!-- Cold-start hint. Only after the wait is long enough to worry about:
           a warm submission never gets far enough to show it. -->
      <Transition name="fade">
        <p
          v-if="status === 'sending' && isSlowSubmit"
          class="flex items-center gap-2 text-xs text-gray-400"
          role="status"
          aria-live="polite"
        >
          <Icon name="heroicons:signal" class="w-3.5 h-3.5 shrink-0" />
          {{ $t('contactSendingSlow') }}
        </p>
      </Transition>

      <!-- Submit -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm
                 bg-primary-700 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed
                 text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25
                 active:scale-95"
        >
          <Icon
            :name="status === 'sending' ? 'heroicons:arrow-path' : 'heroicons:paper-airplane'"
            :class="['w-4 h-4', status === 'sending' ? 'animate-spin' : '']"
          />
          {{ status === 'sending' ? $t('contactSending') : $t('contactSend') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
