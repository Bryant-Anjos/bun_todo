import db from '../db'
import SqliteDatabase from '../services/SqliteDatabase'
import TodosRepository from '../repositories/todos.repository'
import TodosController from '../controllers/todos.controller'

const sqliteDatabase = new SqliteDatabase(db)
const todosRepository = new TodosRepository(sqliteDatabase)
const todosController = new TodosController(todosRepository)

export { todosController }
