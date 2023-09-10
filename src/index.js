import { serve } from 'bun'

import db from './db'
import Router from './services/router'

serve({
  port: 8080,
  fetch(request) {
    const router = new Router(request)

    router.get('todos', () => {
      const query = db.prepare('SELECT * FROM todo')
      const response = query.all()
      query.finalize()

      return Response.json(response)
    })

    router.get('todos/:id', req => {
      const { id } = req.params

      const query = db.prepare('SELECT * FROM todo WHERE id = ?')
      const [todo] = query.all(id)
      query.finalize()

      if (!todo) {
        return Response.json({ error: 'Todo not found.' }, { status: 404 })
      }

      return Response.json(todo)
    })

    router.post('todos', async req => {
      const body = await req.json()
      const { text } = body

      if (!text) {
        return Response.json({ error: 'text not found.' }, { status: 400 })
      }

      const query = db.prepare('INSERT INTO todo (text) VALUES (?) RETURNING *')
      const [todo] = query.all(text)
      query.finalize()

      return Response.json(todo, { status: 201 })
    })

    router.patch('todos/:id', async req => {
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

      const query = db.prepare('UPDATE todo SET done = $done WHERE id = $id')
      query.run({
        $done: isDone,
        $id: id,
      })
      query.finalize()

      return Response.json({ ok: true })
    })

    router.delete('todos/:id', req => {
      const { id } = req.params

      const query = db.prepare('DELETE FROM todo WHERE id = ?')
      query.run(id)
      query.finalize()

      return Response.json({ ok: true })
    })

    return router.response
  },
})
