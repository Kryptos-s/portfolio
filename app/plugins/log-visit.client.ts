// Fires the visitor-telemetry ping once per tab session. The /api/log-visit
// endpoint existed since the Express version but never had a caller; this
// makes the documented feature actually record something.
export default defineNuxtPlugin(() => {
  try {
    if (sessionStorage.getItem('visit-logged')) return
    sessionStorage.setItem('visit-logged', '1')
  } catch {
    /* storage blocked: log anyway, worst case is one row per load */
  }

  $fetch('/api/log-visit', {
    method: 'POST',
    body: {
      platform: navigator.platform || '',
      screen: `${window.screen.width}x${window.screen.height}`
    }
  }).catch(() => {
    /* telemetry is best-effort */
  })
})
