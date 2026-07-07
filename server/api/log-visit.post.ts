// Visitor telemetry — ports POST /api/log-visit from the old routes.js.
// Server-computed fields (ip, user-agent, referrer) take precedence over anything
// the client sends; only whitelisted client fields are stored.
export default defineEventHandler(async (event) => {
  const blocked = checkSameOrigin(event)
  if (blocked) {
    setResponseStatus(event, blocked.status)
    return blocked.body
  }

  try {
    const body = (await readBody(event)) || {}
    const logData = {
      platform: typeof body.platform === 'string' ? body.platform.slice(0, 128) : null,
      screen: typeof body.screen === 'string' ? body.screen.slice(0, 64) : null,
      ip: getRequestIP(event, { xForwardedFor: true }) || null,
      userAgent: (getRequestHeader(event, 'user-agent') || '').slice(0, 512),
      referrer: (getRequestHeader(event, 'referer') || 'Direct/Bookmark').slice(0, 512)
    }
    await logVisitor(logData)
    return { success: true, status: 'logged' }
  } catch (error) {
    console.error('Logging Error:', error instanceof Error ? error.message : error)
    setResponseStatus(event, 500)
    return { error: 'Log failed' }
  }
})
