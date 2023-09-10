import { serve } from 'bun'

import TodosRoutes from './routes/todos.routes'

serve({
  port: 8080,
  fetch(request) {
    const todosRoutes = new TodosRoutes(request)
    return todosRoutes.getResponse()
  },
})
