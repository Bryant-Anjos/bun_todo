export default class TodosController {
  #todosRepository

  constructor(todosRepository) {
    this.#todosRepository = todosRepository
  }

  list = () => {
    const todos = this.#todosRepository.getAll()
    return Response.json(todos)
  }

  get = req => {
    const { id } = req.params
    const todo = this.#todosRepository.getById(id)

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

    const todo = this.#todosRepository.create(text)
    return Response.json(todo, { status: 201 })
  }

  update = async req => {
    const body = await req.json()
    const { done } = body

    if (typeof done !== 'boolean') {
      return Response.json(
        { error: `Invalid value for 'done': ${done}` },
        { status: 400 },
      )
    }

    const { id } = req.params
    this.#todosRepository.update(id, done)
    return Response.json({ ok: true })
  }

  delete = req => {
    const { id } = req.params
    this.#todosRepository.delete(id)
    return Response.json({ ok: true })
  }
}
