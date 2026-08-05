<script setup lang="ts">
import type { FetchError } from 'ofetch'

const { t } = useI18n()

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

async function submit() {
  if (status.value === 'sending') return
  status.value = 'sending'
  errorMsg.value = ''

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
  }
}
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Success state -->
    <Transition name="fade">
      <div
        v-if="status === 'success'"
        class="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div class="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Icon name="heroicons:check-badge" class="w-8 h-8 text-emerald-400" />
        </div>
        <h3 class="text-xl font-bold text-slate-100 font-display transition-colors">{{ $t('contactSuccessTitle') }}</h3>
        <p class="text-slate-400 text-sm">{{ $t('contactSuccessBody') }}</p>
        <button
          class="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
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
        <label for="modal-contact-hp-field">H-Field</label>
        <input 
          id="modal-contact-hp-field" 
          v-model="form._honey" 
          type="text" 
          name="contact_hp_field" 
          autocomplete="new-password" 
          tabindex="-1" 
        >
      </div>

      <!-- Name -->
      <div class="space-y-2">
        <label for="modal-contact-name" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactName') }}
        </label>
        <input
          id="modal-contact-name"
          v-model="form.name"
          type="text"
          name="name"
          required
          minlength="2"
          maxlength="100"
          autocomplete="name"
          :placeholder="$t('contactNamePlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600
                 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all"
        >
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label for="modal-contact-email" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactEmail') }}
        </label>
        <input
          id="modal-contact-email"
          v-model="form.email"
          type="email"
          name="email"
          required
          maxlength="200"
          autocomplete="email"
          :placeholder="$t('contactEmailPlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600
                 text-sm focus:outline-none focus:border-primary-500/70 focus:ring-1 focus:ring-primary-500/30 transition-all"
        >
      </div>

      <!-- Message -->
      <div class="space-y-2">
        <label for="modal-contact-message" class="block text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {{ $t('contactMessage') }}
        </label>
        <textarea
          id="modal-contact-message"
          v-model="form.message"
          name="message"
          required
          minlength="10"
          maxlength="2000"
          rows="5"
          :placeholder="$t('contactMessagePlaceholder')"
          class="w-full bg-dark-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600
                 text-sm focus:outline-none focus:border-primary-500/70 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none"
        />
        <p class="text-right text-xs text-slate-600">{{ form.message.length }} / 2000</p>
      </div>

      <!-- Rate limit / error feedback -->
      <Transition name="fade">
        <div
          v-if="status === 'ratelimit'"
          class="flex items-center gap-2 text-amber-400 bg-amber-950/40 border border-amber-700/30 rounded-lg px-4 py-3 text-sm"
        >
          <Icon name="heroicons:clock" class="w-4 h-4 shrink-0" />
          {{ $t('contactRateLimit') }}
        </div>
        <div
          v-else-if="status === 'error'"
          class="flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-700/30 rounded-lg px-4 py-3 text-sm"
        >
          <Icon name="heroicons:exclamation-circle" class="w-4 h-4 shrink-0" />
          {{ errorMsg || $t('contactErrorGeneric') }}
        </div>
      </Transition>

      <!-- Submit -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm
                 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
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
