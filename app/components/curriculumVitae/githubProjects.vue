<script setup lang="ts">
import type { PublicRepo } from '~~/server/api/github/repos.get'

// Fetched on the server so the section is present in the served HTML.
// The endpoint caches the GitHub response for an hour and returns [] on failure.
//
// `lazy` changes nothing on the server — SSR still awaits it through
// `onServerPrefetch` — but it stops a client-side navigation to /projects from
// blocking on the request. That matters on Amplify compute: a cold Lambda can
// take seconds to answer `/api/github/repos`, and without this the whole page
// waits on it. Now the page renders at once and this section shows skeletons.
const { data: githubRepos, status } = useAsyncData<PublicRepo[]>(
  'github-repos',
  () => $fetch('/api/github/repos'),
  { default: () => [], lazy: true },
)

const isLoading = computed(() => status.value === 'pending')
const hasRepos = computed(() => (githubRepos.value?.length ?? 0) > 0)

// How many placeholder rows to draw while the request is in flight.
const SKELETON_COUNT = 3

const { awesome } = useAppConfig()
const githubUser = computed(() => awesome?.project?.links?.github?.split('/').pop() || '')

const { locale } = useI18n()

// Intl does the pluralisation and the wording in whatever locale is active, so
// these strings never have to be hand-written per language.
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''

  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)

  if (days < 30) return rtf.format(-days, 'day')
  const months = Math.floor(days / 30)
  if (months < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.floor(months / 12), 'year')
}

const repoMeta = (repo: PublicRepo) =>
  [repo.language, repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : '', timeAgo(repo.pushed_at)]
    .filter(Boolean)
    .join(' · ')
</script>

<template>
  <section
    v-if="hasRepos || isLoading"
    id="github-collaborations"
    class="px-4 sm:px-8 pb-14 flex flex-col gap-4"
    aria-labelledby="github-heading"
  >
    <div class="flex flex-wrap justify-between gap-3 text-sm text-muted">
      <h2 id="github-heading" class="font-mono font-normal text-sm text-muted">
        <span aria-hidden="true">$ gh repo list {{ githubUser }} --public</span>
        <span class="sr-only">{{ $t('githubProjects') }}</span>
      </h2>
      <span><span class="text-primary-400" aria-hidden="true">●</span> {{ $t('githubLive') }}</span>
    </div>

    <!-- Placeholders while the request is in flight, so the section keeps its
         space instead of popping in and shoving the footer down. -->
    <div v-if="isLoading" class="flex flex-col gap-3" role="status" aria-live="polite">
      <span class="sr-only">{{ $t('loading') }}</span>
      <div
        v-for="index in SKELETON_COUNT"
        :key="index"
        class="px-6 py-[18px] rounded-[10px] border border-line animate-pulse grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3"
        aria-hidden="true"
      >
        <div class="h-4 w-2/3 rounded bg-slate-800" />
        <div class="h-4 w-full rounded bg-slate-800/70" />
        <div class="h-4 w-1/2 rounded bg-slate-800/70" />
      </div>
    </div>

    <ul v-else class="flex flex-col gap-3">
      <li v-for="repo in githubRepos" :key="repo.id">
        <a
          :href="repo.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-6 py-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] items-center gap-3
                 rounded-[10px] border border-line text-sm text-slate-300 hover:border-primary-500 transition-colors"
        >
          <span class="flex flex-wrap items-center gap-2">
            <span class="font-bold text-white">{{ repo.name }}</span>
            <span v-if="repo.fork" class="px-1.5 py-0.5 rounded border border-line text-[11px] text-muted">{{ $t('fork') }}</span>
          </span>
          <span class="font-sans text-slate-400">{{ repo.description || $t('noDescription') }}</span>
          <span class="text-primary-400">
            {{ repoMeta(repo) }}<template v-if="repoMeta(repo)"> · </template>repo ↗<span class="sr-only"> ({{ $t('opensInNewWindow') }})</span>
          </span>
        </a>
      </li>
    </ul>
  </section>
</template>
