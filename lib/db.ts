import { createClient, type Client } from '@libsql/client/web'

declare global {
  // eslint-disable-next-line no-var
  var _mavxTurso: Client | undefined
  // eslint-disable-next-line no-var
  var _mavxTursoReady: Promise<void> | undefined
}

export const hasDb = () => Boolean(process.env.TURSO_DATABASE_URL)

export async function db(): Promise<Client> {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is not set')
  if (!globalThis._mavxTurso) {
    globalThis._mavxTurso = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  }
  const client = globalThis._mavxTurso
  if (!globalThis._mavxTursoReady) {
    globalThis._mavxTursoReady = client
      .batch(
        [
          `CREATE TABLE IF NOT EXISTS mavx_projects (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT '',
            location TEXT NOT NULL DEFAULT '',
            description TEXT NOT NULL DEFAULT '',
            cover TEXT NOT NULL,
            photos TEXT NOT NULL DEFAULT '[]',
            reels TEXT NOT NULL DEFAULT '[]',
            shape TEXT NOT NULL DEFAULT 'tall',
            created_at TEXT NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS mavx_enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT '',
            message TEXT NOT NULL DEFAULT '',
            at TEXT NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS mavx_meta (key TEXT PRIMARY KEY, value TEXT)`
        ],
        'write'
      )
      .then(() => undefined)
      .catch((err) => {
        globalThis._mavxTursoReady = undefined
        throw err
      })
  }
  await globalThis._mavxTursoReady
  return client
}
