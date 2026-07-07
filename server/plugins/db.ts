// Opens the SQLite connection when the Nitro server boots and closes it on
// shutdown — the lifecycle the old server.js handled around app.listen().
export default defineNitroPlugin(async (nitroApp) => {
  try {
    await initDatabase()
  } catch (err) {
    console.error('Failed to initialize database:', err instanceof Error ? err.message : err)
  }

  nitroApp.hooks.hook('close', async () => {
    await closeDatabase()
  })
})
