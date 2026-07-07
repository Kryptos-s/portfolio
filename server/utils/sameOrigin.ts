import type { H3Event } from 'h3'

// Reject cross-site POSTs: the Origin header (or Referer fallback) host must
// match the Host serving the request. Cheap CSRF mitigation for a no-cookie site.
// Ported from the sameOriginOnly middleware in the old routes.js.
// Returns a { status, body } to send when blocked, or null when the request is ok.
export function checkSameOrigin(event: H3Event): { status: number; body: object } | null {
  const origin = getRequestHeader(event, 'origin') || getRequestHeader(event, 'referer') || ''
  if (!origin) {
    return { status: 403, body: { success: false, message: 'Origin required.' } }
  }

  let host: string
  try {
    host = new URL(origin).host
  } catch {
    return { status: 403, body: { success: false, message: 'Invalid origin.' } }
  }

  if (host !== getRequestHeader(event, 'host')) {
    return { status: 403, body: { success: false, message: 'Cross-site request blocked.' } }
  }

  return null
}
