/** @param {import('bun:sqlite').Database} db */
export default function initDB(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `)
}
