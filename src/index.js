import { serve } from 'bun'

import db from './db'
import Router from './services/router'
import TodosController from './controllers/todos.controller'

const todosController = new TodosController(db)

serve({
  port: 8080,
  fetch(request) {
    const router = new Router(request)

    router.get('todos', todosController.list)
    router.get('todos/:id', todosController.get)
    router.post('todos', todosController.create)
    router.patch('todos/:id', todosController.update)
    router.delete('todos/:id', todosController.delete)

    return router.response
  },
})
