import { Database } from 'bun:sqlite'

import initDB from './initDB'

const db = new Database('db.sqlite', { create: true })

initDB(db)

export default db
