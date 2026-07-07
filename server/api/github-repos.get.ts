// GitHub proxy — cached in-memory for 5 min, coalesces concurrent refreshes,
// serves stale on upstream failure. Ported from the old Express routes.js.
// Module-level state persists for the life of the Nitro server process.

interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  updated: string
}

const GITHUB_TTL_MS = 5 * 60 * 1000
let githubCache: { data: Repo[] | null; fetchedAt: number } = { data: null, fetchedAt: 0 }
let githubInflight: Promise<Repo[]> | null = null

async function fetchGithubRepos(): Promise<Repo[]> {
  const config = useRuntimeConfig()
  const username = config.githubUsername
  if (!username) throw new Error('GitHub integration not configured.')

  const headers: Record<string, string> = { 'User-Agent': 'Kryptos-Terminal-Portfolio' }
  if (config.githubToken) {
    headers.Authorization = `token ${config.githubToken}`
  }

  const data = await $fetch<any[]>(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
    {
      query: { sort: 'updated', per_page: 10 },
      headers,
      timeout: 8000
    }
  )

  return data.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url,
    updated: repo.updated_at
  }))
}

export default defineEventHandler(async (event) => {
  const now = Date.now()
  const fresh = githubCache.data && now - githubCache.fetchedAt < GITHUB_TTL_MS

  if (fresh) {
    setResponseHeader(event, 'Cache-Control', `public, max-age=${Math.floor(GITHUB_TTL_MS / 1000)}`)
    return githubCache.data
  }

  // Coalesce concurrent refreshes to one upstream call.
  if (!githubInflight) {
    githubInflight = fetchGithubRepos()
      .then((data) => {
        githubCache = { data, fetchedAt: Date.now() }
        return data
      })
      .finally(() => {
        githubInflight = null
      })
  }

  try {
    const data = await githubInflight
    setResponseHeader(event, 'Cache-Control', `public, max-age=${Math.floor(GITHUB_TTL_MS / 1000)}`)
    return data
  } catch (error) {
    console.error('GitHub Proxy Error:', error instanceof Error ? error.message : error)
    // Serve stale if we have it; otherwise error.
    if (githubCache.data) {
      setResponseHeader(event, 'Cache-Control', 'public, max-age=30')
      setResponseHeader(event, 'X-Cache-Status', 'stale')
      return githubCache.data
    }
    setResponseStatus(event, 502)
    return { error: 'System link to GitHub offline.' }
  }
})
