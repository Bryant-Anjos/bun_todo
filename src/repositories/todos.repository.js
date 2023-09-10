import Todo from '../models/todo.model'

export default class TodosRepository {
  #database

  constructor(db) {
    this.#database = db
  }

  getAll = () => {
    const response = this.#database.runSQL('SELECT * FROM todo')
    const todos = response.map(item => new Todo(item.id, item.text, item.done))
    return todos
  }

  getById = id => {
    const [item] = this.#database.runSQL('SELECT * FROM todo WHERE id = $id', {
      $id: id,
    })

    if (!item) {
      return null
    }

    const todo = new Todo(item.id, item.text, item.done)
    return todo
  }

  create = text => {
    const [item] = this.#database.runSQL(
      'INSERT INTO todo (text) VALUES ($text) RETURNING *',
      { $text: text },
    )
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

    this.#database.runSQL('UPDATE todo SET done = $done WHERE id = $id', {
      $done: isDone,
      $id: id,
    })
  }

  delete = id => {
    this.#database.runSQL('DELETE FROM todo WHERE id = $id', { $id: id })
  }
}
