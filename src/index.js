import { serve } from 'bun'

import db from './db'

serve({
  port: 8080,
  fetch(request, response) {
    const url = new URL(request.url)

    if (url.pathname === '/todos/new') {
      const text = url.searchParams.get('text')

      if (!text) {
        return Response.json({ error: 'text not found.' }, { status: 400 })
      }

      const query = db.prepare('INSERT INTO todo (text) VALUES (?) RETURNING *')
      const [todo] = query.all(text)
      query.finalize()

      return Response.json(todo, { status: 201 })
    }

    if (url.pathname === '/todos/all') {
      const query = db.prepare('SELECT * FROM todo')
      const response = query.all()
      query.finalize()

      return Response.json(response)
    }

    if (/^\/todos\/(.+)\/done\/?$/.test(url.pathname)) {
      const done = url.searchParams.get('done')
      let isDone

      if (done === 'true') {
        isDone = 1
      } else if (done === 'false') {
        isDone = 0
      } else {
        return Response.json(
          { error: `Invalid value for 'done': ${done}` },
          { status: 400 },
        )
      }

      const [, id] = /^\/todos\/(.+)\/done\/?$/.exec(url.pathname)

      const query = db.prepare('UPDATE todo SET done = $done WHERE id = $id')
      query.run({
        $done: isDone,
        $id: id,
      })
      query.finalize()

      return Response.json({ ok: true })
    }

    if (/^\/todos\/(.+)\/get\/?$/.test(url.pathname)) {
      const [, id] = /^\/todos\/(.+)\/get\/?$/.exec(url.pathname)

      const query = db.prepare('SELECT * FROM todo WHERE id = ?')
      const [todo] = query.all(id)
      query.finalize()

      return Response.json(todo)
    }

    if (/^\/todos\/(.+)\/delete\/?$/.test(url.pathname)) {
      const [, id] = /^\/todos\/(.+)\/delete\/?$/.exec(url.pathname)

      const query = db.prepare('DELETE FROM todo WHERE id = ?')
      query.run(id)
      query.finalize()

      return Response.json({ ok: true })
    }

    return Response.json({ 404: 'Not found!' }, { status: 404 })
  },
})
