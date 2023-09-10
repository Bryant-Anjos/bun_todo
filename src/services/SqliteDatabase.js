export default class SqliteDatabase {
  #db

  constructor(connection) {
    this.#db = connection
  }

  runSQL(sql, params) {
    const query = this.#db.prepare(sql)
    const response = query.all(params)

    query.finalize()

    return response
  }
}
