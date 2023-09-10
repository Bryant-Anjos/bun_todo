import Router from '../services/router'

export default class TodosRoutes {
  #router
  #todosController

  constructor(request, todosController) {
    this.#router = new Router(request)
    this.#todosController = todosController
    this.#routes()
  }

  #routes = () => {
    this.#router.get('todos', this.#todosController.list)
    this.#router.get('todos/:id', this.#todosController.get)
    this.#router.post('todos', this.#todosController.create)
    this.#router.patch('todos/:id', this.#todosController.update)
    this.#router.delete('todos/:id', this.#todosController.delete)
  }

  getResponse = () => {
    return this.#router.response
  }
}
