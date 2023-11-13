import { Router } from 'express'
import users from './controllers/UsersController'
import authMiddleware from '../Auth/middlewares/AuthMiddleware'

const routes = Router()

routes.get('/users', authMiddleware, users.index)

export default routes
