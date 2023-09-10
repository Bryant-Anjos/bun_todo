import { todosController } from '../modules/todos.module'
import Router from '../services/router'

export default class TodosRoutes {
  #router

  constructor(request) {
    this.#router = new Router(request)
    this.#routes()
  }

  #routes = () => {
    this.#router.get('todos', todosController.list)
    this.#router.get('todos/:id', todosController.get)
    this.#router.post('todos', todosController.create)
    this.#router.patch('todos/:id', todosController.update)
    this.#router.delete('todos/:id', todosController.delete)
  }

  getResponse = () => {
    return this.#router.response
  }
}
