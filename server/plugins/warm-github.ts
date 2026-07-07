// Warm the GitHub proxy's in-memory cache at boot so the first real visitor's
// SSR render doesn't wait on the upstream call.
export default defineNitroPlugin(() => {
  void $fetch('/api/github-repos').catch(() => {
    /* best effort; the route's stale-serving handles later failures */
  })
})
