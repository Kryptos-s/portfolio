// SQLite interface — ported from the old server/db.js.
// Single long-lived connection; sqlite3 serializes writes, WAL lets readers run
// alongside a writer.
//
// The connection is cached on globalThis so it survives Nitro's dev-time module
// re-evaluation (a plain module-level singleton can end up null in a route that
// was evaluated separately from the init plugin).
import sqlite3 from 'sqlite3'
import path from 'node:path'

const sql = sqlite3.verbose()

const PROJECT_ROOT = process.cwd()
const DEFAULT_DB = path.join(PROJECT_ROOT, 'server', 'portfolio.db')

// If DATABASE_PATH is set and resolves inside the project, use it; otherwise the
// hard-coded default. Rejects anything that escapes the project directory.
function resolveDbFile() {
  const raw = process.env.DATABASE_PATH
  if (!raw) return DEFAULT_DB
  const resolved = path.isAbsolute(raw) ? raw : path.resolve(PROJECT_ROOT, raw)
  if (!resolved.startsWith(PROJECT_ROOT + path.sep) && resolved !== PROJECT_ROOT) {
    console.warn('DATABASE_PATH escapes project root; falling back to default.')
    return DEFAULT_DB
  }
  return resolved
}

const DB_FILE = resolveDbFile()

const g = globalThis as typeof globalThis & {
  __portfolioDb?: sqlite3.Database
  __portfolioDbInit?: Promise<sqlite3.Database>
}

function open(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const database = new sql.Database(DB_FILE, (err) => {
      if (err) return reject(err)
      console.log('Connected to SQLite database:', DB_FILE)
    })

    database.serialize(() => {
      database.run('PRAGMA journal_mode = WAL')
      database.run('PRAGMA busy_timeout = 5000')

      database.run(
        `CREATE TABLE IF NOT EXISTS visitor_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ip TEXT,
          user_agent TEXT,
          referrer TEXT,
          platform TEXT,
          screen TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) return reject(err)
          g.__portfolioDb = database
          resolve(database)
        }
      )
    })
  })
}

// Initialise once; the in-flight promise is cached so concurrent callers share it.
export function initDatabase(): Promise<sqlite3.Database> {
  if (!g.__portfolioDbInit) {
    g.__portfolioDbInit = open().catch((err) => {
      g.__portfolioDbInit = undefined
      throw err
    })
  }
  return g.__portfolioDbInit
}

async function getDb(): Promise<sqlite3.Database> {
  return g.__portfolioDb ?? (await initDatabase())
}

export function closeDatabase(): Promise<void> {
  return new Promise((resolve) => {
    const database = g.__portfolioDb
    if (!database) return resolve()
    database.close((err) => {
      if (err) console.error('Error closing DB:', err.message)
      g.__portfolioDb = undefined
      g.__portfolioDbInit = undefined
      resolve()
    })
  })
}

export interface VisitorData {
  ip?: string | null
  userAgent?: string | null
  referrer?: string | null
  platform?: string | null
  screen?: string | null
}

export async function logVisitor(data: VisitorData): Promise<number> {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    const stmt = `
      INSERT INTO visitor_logs (ip, user_agent, referrer, platform, screen)
      VALUES (?, ?, ?, ?, ?)
    `
    const params = [
      data.ip || null,
      data.userAgent || null,
      data.referrer || null,
      data.platform || null,
      data.screen || null
    ]
    db.run(stmt, params, function (err) {
      if (err) reject(err)
      else resolve(this.lastID)
    })
  })
}
