import { expect, test } from 'bun:test'

import TodosController from './todos.controller'

const fakeTodosRepository = () => {
  let todos = [
    {
      id: 1,
      text: 'do homework',
      done: false,
    },
    {
      id: 2,
      text: 'go home',
      done: false,
    },
    {
      id: 3,
      text: 'run',
      done: false,
    },
  ]

  return {
    getAll() {
      return todos
    },
    getById(id) {
      return todos.find(todo => todo.id === id)
    },
    create(text) {
      const newTodo = {
        id: todos[todos.length - 1].id + 1,
        text,
        done: false,
      }
      todos.push(newTodo)
      return newTodo
    },
    update(id, done) {
      const index = todos.findIndex(todo => todo.id === id)
      todos[index].done = done
    },
    delete(id) {
      todos = todos.filter(todo => todo.id !== id)
    },
  }
}

const json = value => () => value

test('todosController.list return all todos', async () => {
  const todosController = new TodosController(fakeTodosRepository())
  const response = todosController.list()
  const todos = await response.json()

  expect(response.status).toBe(200)
  expect(todos.length).toBe(3)
  expect(todos).toEqual([
    {
      id: 1,
      text: 'do homework',
      done: false,
    },
    {
      id: 2,
      text: 'go home',
      done: false,
    },
    {
      id: 3,
      text: 'run',
      done: false,
    },
  ])
})

test('todosController.get return only the expected todo', async () => {
  const todosController = new TodosController(fakeTodosRepository())
  const response1 = todosController.get({ params: { id: 1 } })
  const response2 = todosController.get({ params: { id: 2 } })
  const response3 = todosController.get({ params: { id: 3 } })
  const response4 = todosController.get({ params: { id: 4 } })

  const todo1 = await response1.json()
  const todo2 = await response2.json()
  const todo3 = await response3.json()
  const todo4 = await response4.json()

  expect(response1.status).toBe(200)
  expect(response2.status).toBe(200)
  expect(response3.status).toBe(200)
  expect(response4.status).toBe(404)

  expect(todo1).toEqual({
    id: 1,
    text: 'do homework',
    done: false,
  })
  expect(todo2).toEqual({
    id: 2,
    text: 'go home',
    done: false,
  })
  expect(todo3).toEqual({
    id: 3,
    text: 'run',
    done: false,
  })
  expect(todo4).toEqual({
    error: 'Todo not found.',
  })
})

test('todosController.create to add new todos', async () => {
  const todosController = new TodosController(fakeTodosRepository())

  const createResponse1 = await todosController.create({
    json: json({ text: 'create test' }),
  })
  const todo1 = await createResponse1.json()

  expect(createResponse1.status).toBe(201)
  expect(todo1).toEqual({
    id: 4,
    text: 'create test',
    done: false,
  })

  const createResponse2 = await todosController.create({
    json: json({}),
  })
  const todo2 = await createResponse2.json()

  expect(createResponse2.status).toBe(400)
  expect(todo2).toEqual({
    error: 'text not found.',
  })

  const listResponse = todosController.list()
  const todos = await listResponse.json()

  expect(todos.length).toBe(4)
})

test('todosController.update to change the done status', async () => {
  const todosController = new TodosController(fakeTodosRepository())

  const responseBeforeUpdate = todosController.get({ params: { id: 2 } })
  const todoBeforeUpdate = await responseBeforeUpdate.json()

  expect(todoBeforeUpdate).toEqual({
    id: 2,
    text: 'go home',
    done: false,
  })

  const updateResponse = await todosController.update({
    params: { id: 2 },
    json: json({ done: true }),
  })

  expect(updateResponse.status).toBe(200)

  const responseAfterUpdate = todosController.get({ params: { id: 2 } })
  const todoAfterUpdate = await responseAfterUpdate.json()

  expect(todoAfterUpdate).toEqual({
    id: 2,
    text: 'go home',
    done: true,
  })

  const updateResponseError = await todosController.update({
    params: { id: 2 },
    json: json({}),
  })

  expect(updateResponseError.status).toBe(400)

  const error = await updateResponseError.json()

  expect(error).toEqual({
    error: "Invalid value for 'done': undefined",
  })
})

test('todosController.delete to delete a todo', async () => {
  const todosController = new TodosController(fakeTodosRepository())

  const responseBeforeDelete = todosController.list()
  const todosBeforeDelete = await responseBeforeDelete.json()

  expect(todosBeforeDelete.length).toBe(3)

  const deleteResponse = todosController.delete({ params: { id: 1 } })

  expect(deleteResponse.status).toBe(200)

  const responseAfterDelete = todosController.list()
  const todosAfterDelete = await responseAfterDelete.json()

  expect(todosAfterDelete.length).toBe(2)
  expect(todosAfterDelete).toEqual([
    {
      id: 2,
      text: 'go home',
      done: false,
    },
    {
      id: 3,
      text: 'run',
      done: false,
    },
  ])
})
