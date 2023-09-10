import db from '../db'
import TodosRepository from '../repositories/todos.repository'
import TodosController from '../controllers/todos.controller'

const todosRepository = new TodosRepository(db)
const todosController = new TodosController(todosRepository)

export { todosController }
