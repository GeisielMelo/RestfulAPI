import { Router } from 'express'
import users from './controllers/UsersController'
import authMiddleware from '../Auth/middlewares/AuthMiddleware'
import ownerMiddleware from '../Auth/middlewares/OwnerMiddleware'

const routes = Router()

routes.get('/users', authMiddleware, users.index)
routes.post('/users/message', authMiddleware, ownerMiddleware, users.message)

export default routes
