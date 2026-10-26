<script setup lang="ts">
import type { FetchError } from 'ofetch'

const { t } = useI18n()

// Unique per instance, so the ids can never collide if the form is ever
// rendered twice on one page.
const uid = useId()
const nameId = `${uid}-name`
const emailId = `${uid}-email`
const messageId = `${uid}-message`
const messageHintId = `${uid}-message-hint`
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
  <!-- A terminal window: the form is the script, the success state its output. -->
  <div class="flex flex-col overflow-hidden rounded-[10px] border border-line bg-panel">
    <div class="px-4 py-3 flex items-center gap-1.5 border-b border-line" aria-hidden="true">
      <span class="size-2.5 rounded-full bg-slate-700" />
      <span class="size-2.5 rounded-full bg-slate-700" />
      <span class="size-2.5 rounded-full bg-slate-700" />
      <span class="ml-2.5 text-xs text-muted">{{ $t('contactWindowTitle') }}</span>
    </div>

    <div
      v-if="status === 'success'"
      role="status"
      class="px-7 py-12 flex flex-col gap-4 text-sm"
    >
      <p class="text-muted" aria-hidden="true">$ ./contact --send</p>
      <p>
        <span class="text-primary-400" aria-hidden="true">✓</span> {{ $t('contactDelivered') }}
        <span class="text-muted" aria-hidden="true">· exit 0</span>
      </p>
      <h2
        ref="successHeading"
        tabindex="-1"
        class="font-display font-bold text-[28px] text-white"
      >{{ $t('contactSuccessTitle') }}</h2>
      <p class="font-sans text-base leading-relaxed text-slate-400">{{ $t('contactSuccessBody') }}</p>
      <button
        type="button"
        class="self-start px-3.5 py-2.5 rounded-md border border-slate-500 hover:border-primary-500 text-[13px] text-slate-200 transition-colors"
        @click="status = 'idle'"
      >
        {{ $t('contactSendAnother') }}
      </button>
    </div>

    <form v-else class="relative p-7 flex flex-col gap-[22px]" @submit.prevent="submit">
      <h2 class="sr-only">{{ $t('contactTitle') }}</h2>

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

      <!-- Labels read as flags, `--nombre`; the dashes are hidden from
           assistive technology, which hears just the field name. -->
      <div class="flex flex-col gap-2">
        <label :for="nameId" class="text-xs text-muted">
          <span aria-hidden="true">--</span>{{ $t('contactName').toLocaleLowerCase() }}
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
          class="field-line"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label :for="emailId" class="text-xs text-muted">
          <span aria-hidden="true">--</span>{{ $t('contactEmail').toLocaleLowerCase() }}
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
          class="field-line"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label :for="messageId" class="text-xs text-muted">
          <span aria-hidden="true">--</span>{{ $t('contactMessage').toLocaleLowerCase() }}
        </label>
        <textarea
          :id="messageId"
          v-model="form.message"
          :aria-describedby="messageHintId"
          name="message"
          required
          minlength="10"
          maxlength="2000"
          rows="6"
          :placeholder="$t('contactMessagePlaceholder')"
          class="px-3 py-3 rounded-md border border-slate-500 bg-transparent font-sans text-base text-slate-200
                 placeholder:text-muted resize-y transition-colors
                 focus:border-primary-500 focus-visible:outline-none"
        />
        <!-- The bounds are spelled out for anyone who cannot see the counter;
             the browser otherwise only mentions them once it has already
             rejected the submission. -->
        <p :id="messageHintId" class="text-[11px] text-muted">
          {{ $t('contactMessageHint') }} ({{ form.message.length }}/2000)
        </p>
      </div>

      <div
        v-if="status === 'ratelimit'"
        role="alert"
        class="flex items-center gap-2 px-4 py-3 rounded-md border border-amber-700/40 bg-amber-950/40 text-xs text-amber-400"
      >
        <Icon name="heroicons:clock" class="shrink-0 text-sm" aria-hidden="true" />
        {{ $t('contactRateLimit') }}
      </div>
      <div
        v-else-if="status === 'error'"
        role="alert"
        class="flex items-center gap-2 px-4 py-3 rounded-md border border-red-700/40 bg-red-950/40 text-xs text-red-400"
      >
        <Icon name="heroicons:exclamation-circle" class="shrink-0 text-sm" aria-hidden="true" />
        {{ errorMsg || $t('contactErrorGeneric') }}
      </div>

      <!-- Cold-start hint. Only after the wait is long enough to worry about:
           a warm submission never gets far enough to show it. -->
      <p
        v-if="status === 'sending' && isSlowSubmit"
        class="text-xs text-slate-400"
        role="status"
        aria-live="polite"
      >
        {{ $t('contactSendingSlow') }}
      </p>

      <div class="flex flex-wrap justify-between items-center gap-3">
        <span class="text-xs text-muted">↵ {{ $t('contactSendNote') }}</span>
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-primary-700 hover:bg-primary-600
                 disabled:bg-slate-700 disabled:cursor-not-allowed font-sans font-bold text-sm text-white transition-colors"
        >
          <Icon
            :name="status === 'sending' ? 'heroicons:arrow-path' : 'heroicons:paper-airplane'"
            :class="status === 'sending' ? 'animate-spin' : ''"
            aria-hidden="true"
          />
          {{ status === 'sending' ? $t('contactSending') : $t('contactSend') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Name and email are underlined fields, as in the design. Focus thickens the
   rule and turns it green: a 2px line, as easy to spot as an outline. */
.field-line {
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--color-slate-500);
  background: transparent;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-slate-200);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-line::placeholder {
  color: var(--color-muted);
}

.field-line:focus-visible {
  outline: none;
  border-bottom-color: var(--color-primary-400);
  box-shadow: 0 1px 0 var(--color-primary-400);
}
</style>
