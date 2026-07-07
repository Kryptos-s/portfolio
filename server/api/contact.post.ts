// Contact form endpoint — ports POST /api/contact from the old routes.js.
export default defineEventHandler(async (event) => {
  const blocked = checkSameOrigin(event)
  if (blocked) {
    setResponseStatus(event, blocked.status)
    return blocked.body
  }

  const body = await readBody(event)
  const result = validateContact(body)
  if (!result.valid) {
    setResponseStatus(event, 400)
    return { success: false, errors: result.errors }
  }

  try {
    const ip = getRequestIP(event, { xForwardedFor: true }) || ''
    const messageId = await insertMessage({ ...result.data!, ip })
    return { success: true, message: 'Message successfully stored.', messageId }
  } catch (error) {
    console.error('Contact Form Error:', error instanceof Error ? error.message : error)
    setResponseStatus(event, 500)
    return { success: false, message: 'Internal server error.' }
  }
})
