<script setup lang="ts">
import type { PublicRepo } from '~~/server/api/github/repos.get'

// Fetched on the server so the section is present in the served HTML.
// The endpoint caches the GitHub response for an hour and returns [] on failure.
const { data: githubRepos } = await useAsyncData<PublicRepo[]>(
  'github-repos',
  () => $fetch('/api/github/repos'),
  { default: () => [] },
)

const hasRepos = computed(() => (githubRepos.value?.length ?? 0) > 0)

const { locale } = useI18n()

// Intl does the pluralisation and the wording in whatever locale is active, so
// these strings no longer have to be hand-written — and no longer come out in
// English on a page served as `lang="es"` or `lang="ca"`.
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''

  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)

  if (days < 30) return rtf.format(-days, 'day')
  const months = Math.floor(days / 30)
  if (months < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.floor(months / 12), 'year')
}
</script>

<template>
  <div v-if="hasRepos" class="mx-auto px-4 2xl:px-0 h-fit mt-12 mb-24">
    <div id="github-collaborations" class="mb-8">
      <div class="flex items-center gap-3">
          <Icon name="simple-icons:github" class="w-8 h-8 text-slate-100" />
          <h2 class="leading-normal text-3xl font-display font-bold text-white">
            {{ $t('githubProjects') || 'Open Source & Collaborations' }}
          </h2>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="repo in githubRepos"
        :key="repo.id"
        class="glass-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 border-slate-700/50"
      >
        <!-- Gradient overlay on hover -->
        <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

        <div class="p-6 md:p-8 relative z-10 flex flex-col h-full">

          <!-- Header: name + badges -->
          <div class="flex justify-between items-start mb-4 gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-xl md:text-2xl text-slate-100 font-display group-hover:text-primary-300 transition-colors">{{ repo.name }}</h3>
              <!-- Fork badge -->
              <span v-if="repo.fork" class="flex items-center gap-1 text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-700/40">
                <Icon name="heroicons:arrow-path-rounded-square" class="w-3 h-3" />
                {{ $t('fork') }}
              </span>
            </div>
            <!-- Stars + forks -->
            <div class="flex items-center gap-2 shrink-0">
              <div v-if="repo.stargazers_count > 0" class="flex items-center gap-1 text-xs font-mono text-amber-400 bg-dark-950/50 px-2 py-1 rounded border border-slate-800">
                 <Icon name="heroicons:star-solid" class="w-3 h-3" />
                {{ repo.stargazers_count }}
              </div>
              <div v-if="repo.forks_count > 0" class="flex items-center gap-1 text-xs font-mono text-slate-400 bg-dark-950/50 px-2 py-1 rounded border border-slate-800">
                <Icon name="heroicons:arrow-path-rounded-square" class="w-3 h-3" />
                {{ repo.forks_count }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="repo.description" class="mb-4 flex-grow">
             <span class="text-secondary-400 font-semibold text-xs uppercase tracking-wider mb-2 block">{{ $t('description') }}</span>
             <p class="text-slate-300 text-sm leading-relaxed">
                 {{ repo.description }}
             </p>
          </div>
          <div v-else class="mb-4 flex-grow text-slate-400 italic text-sm">
             {{ $t('noDescription') }}
          </div>

          <!-- Topics chips -->
          <div v-if="repo.topics && repo.topics.length > 0" class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="topic in repo.topics"
              :key="topic"
              class="text-xs font-mono px-2 py-0.5 rounded-full border transition-colors
                     text-primary-300 bg-primary-950/40 border-primary-700/30
                     hover:bg-primary-900/40 hover:border-primary-500/50"
            >
              {{ topic }}
            </span>
          </div>

          <!-- Footer: language + last push + links -->
          <div class="space-y-3 mt-auto border-t border-slate-700/50 pt-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <!-- Primary language -->
              <div v-if="repo.language" class="flex items-center gap-2 text-slate-300 text-sm">
                <span class="w-2 h-2 rounded-full bg-primary-500 shrink-0"/>
                <span class="text-slate-400 text-xs uppercase tracking-wider mr-1">{{ $t('primaryLanguage') }}:</span>
                {{ repo.language }}
              </div>
              <!-- Last push -->
              <div v-if="repo.pushed_at" class="flex items-center gap-1 text-xs text-slate-400">
                <Icon name="heroicons:clock" class="w-3 h-3" />
                {{ timeAgo(repo.pushed_at) }}
              </div>
            </div>

            <!-- Action links -->
            <div class="flex items-center justify-between gap-3 pt-1">
              <!-- Live site -->
              <a
                v-if="repo.homepage"
                :href="repo.homepage"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Icon name="heroicons:globe-alt" class="w-3.5 h-3.5" />
                {{ $t('liveDemo') }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
              </a>
              <span v-else/>
              <!-- View repo -->
              <a :href="repo.html_url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm font-bold text-secondary-400 hover:text-secondary-300 transition-colors">
                 {{ $t('viewRepository') }}<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
                 <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
