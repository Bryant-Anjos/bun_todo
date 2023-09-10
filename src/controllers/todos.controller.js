export default class TodosController {
  #db

  constructor(db) {
    this.#db = db
  }

  list = () => {
    const query = this.#db.prepare('SELECT * FROM todo')
    const response = query.all()
    query.finalize()

    return Response.json(response)
  }

  get = req => {
    const { id } = req.params

    const query = this.#db.prepare('SELECT * FROM todo WHERE id = ?')
    const [todo] = query.all(id)
    query.finalize()

    if (!todo) {
      return Response.json({ error: 'Todo not found.' }, { status: 404 })
    }

    return Response.json(todo)
  }

  create = async req => {
    const body = await req.json()
    const { text } = body

    if (!text) {
      return Response.json({ error: 'text not found.' }, { status: 400 })
    }

    const query = this.#db.prepare(
      'INSERT INTO todo (text) VALUES (?) RETURNING *',
    )
    const [todo] = query.all(text)
    query.finalize()

    return Response.json(todo, { status: 201 })
  }

  update = async req => {
    const body = await req.json()
    const { done } = body
    let isDone

    if (done === true) {
      isDone = 1
    } else if (done === false) {
      isDone = 0
    } else {
      return Response.json(
        { error: `Invalid value for 'done': ${done}` },
        { status: 400 },
      )
    }

    const { id } = req.params

    const query = this.#db.prepare(
      'UPDATE todo SET done = $done WHERE id = $id',
    )
    query.run({
      $done: isDone,
      $id: id,
    })
    query.finalize()

    return Response.json({ ok: true })
  }

  delete = req => {
    const { id } = req.params

    const query = this.#db.prepare('DELETE FROM todo WHERE id = ?')
    query.run(id)
    query.finalize()

    return Response.json({ ok: true })
  }
}
