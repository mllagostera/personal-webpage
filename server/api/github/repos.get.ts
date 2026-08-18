const GITHUB_USERNAME = 'mllagostera'
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`

export interface PublicRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  fork: boolean
  stargazers_count: number
  forks_count: number
  pushed_at: string | null
}

/**
 * Cached for an hour, so the unauthenticated GitHub API (60 req/h per IP) is hit
 * at most once per hour no matter how much traffic the page gets.
 */
const fetchRepos = defineCachedFunction(
  async (): Promise<PublicRepo[]> => {
    const repos = await $fetch<PublicRepo[]>(GITHUB_API, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'mllagostera.com',
      },
    })

    // Keep only what the UI renders; the rest would bloat the SSR payload.
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics || [],
      fork: repo.fork,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      pushed_at: repo.pushed_at,
    }))
  },
  {
    name: 'github',
    getKey: () => 'repos',
    maxAge: 60 * 60,
  },
)

export default defineEventHandler(async (): Promise<PublicRepo[]> => {
  try {
    return await fetchRepos()
  }
  catch (error) {
    // A GitHub outage must not break the page: the section hides itself when
    // the list comes back empty.
    console.error('[github] could not fetch public repositories:', error)
    return []
  }
})
