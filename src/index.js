import { serve } from 'bun'

import Router from './services/router'
import { todosController } from './modules/todos.module'

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
