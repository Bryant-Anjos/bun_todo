import Todo from '../models/todo.model'

export default class TodosRepository {
  #db

  constructor(db) {
    this.#db = db
  }

  getAll = () => {
    const query = this.#db.prepare('SELECT * FROM todo')
    const response = query.all()

    query.finalize()

    const todos = response.map(item => new Todo(item.id, item.text, item.done))
    return todos
  }

  getById = id => {
    const query = this.#db.prepare('SELECT * FROM todo WHERE id = ?')
    const [item] = query.all(id)

    query.finalize()

    if (!item) {
      return null
    }

    const todo = new Todo(item.id, item.text, item.done)
    return todo
  }

  create = text => {
    const query = this.#db.prepare(
      'INSERT INTO todo (text) VALUES (?) RETURNING *',
    )
    const [item] = query.all(text)

    query.finalize()

    const todo = new Todo(item.id, item.text, item.done)
    return todo
  }

  update = (id, done) => {
    let isDone

    if (done) {
      isDone = 1
    } else {
      isDone = 0
    }

    const query = this.#db.prepare(
      'UPDATE todo SET done = $done WHERE id = $id',
    )
    query.run({
      $done: isDone,
      $id: id,
    })
    query.finalize()
  }

  delete = id => {
    const query = this.#db.prepare('DELETE FROM todo WHERE id = ?')
    query.run(id)
    query.finalize()
  }
}
