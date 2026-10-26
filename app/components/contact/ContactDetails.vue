<script setup lang="ts">
const { awesome } = useAppConfig()
const socialLinks = useSocialLinks()

// Rendered server-side as plain text, so crawlers read the address itself
// instead of only finding it behind a mailto: handler.
const email = computed(() => awesome?.author?.email || '')

// `legacy` falls back to execCommand where the async Clipboard API is missing
// (plain http, older Safari), so the button can always be rendered.
const { copy, copied } = useClipboard({ legacy: true, copiedDuring: 1800 })
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="text-sm text-muted" aria-hidden="true">$ ./contact --to miquel</p>
    <h1 class="font-display font-extrabold text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.02em] text-white text-pretty">
      {{ $t('contactHeroTitle') }}
    </h1>
    <p class="font-sans text-lg leading-relaxed text-slate-400 text-pretty">{{ $t('contactHeroDescription') }}</p>

    <div class="flex flex-col rounded-[10px] border border-line">
      <div v-if="email" class="px-5 py-[18px] flex justify-between items-center gap-3 border-b border-line">
        <div class="min-w-0 flex flex-col gap-1">
          <span class="text-[11px] text-muted">{{ $t('contactDirectLabel') }}</span>
          <a :href="`mailto:${email}`" class="text-[15px] text-primary-400 hover:text-primary-300 break-all transition-colors">{{ email }}</a>
        </div>
        <button
          type="button"
          class="shrink-0 px-1 text-xs transition-colors"
          :class="copied ? 'text-primary-400' : 'text-muted hover:text-slate-200'"
          :aria-label="$t('copyEmail')"
          @click="copy(email)"
        >
          {{ copied ? `✓ ${$t('copied')}` : $t('copy') }}
        </button>
        <span class="sr-only" role="status">{{ copied ? $t('copied') : '' }}</span>
      </div>

      <ul class="grid grid-cols-2 [&>li:nth-child(odd)]:border-r [&>li:nth-child(-n+2)]:border-b [&>li]:border-line">
        <li v-for="social in socialLinks" :key="social.href">
          <a
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-3.5 flex items-center gap-2.5 text-[13px] text-slate-300 hover:text-primary-400 hover:bg-panel transition-colors"
          >
            <Icon :name="social.icon" :class="social.small ? 'text-sm' : 'text-lg'" class="text-slate-400" aria-hidden="true" />
            {{ social.label.toLowerCase() }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
