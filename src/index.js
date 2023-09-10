import { serve } from 'bun'

import TodosRoutes from './routes/todos.routes'
import { todosController } from './modules/todos.module'

serve({
  port: 8080,
  fetch(request) {
    const todosRoutes = new TodosRoutes(request, todosController)
    return todosRoutes.getResponse()
  },
})
