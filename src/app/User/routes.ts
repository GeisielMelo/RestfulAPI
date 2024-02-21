import { Router } from 'express'
import users from '../User/controllers/UsersController'
import authMiddleware from '../Auth/middlewares/AuthMiddleware'
import ownerMiddleware from '../Auth/middlewares/OwnerMiddleware'

const routes = Router()

routes.get('/api/users/:id', authMiddleware, ownerMiddleware, users.show)
routes.post('/api/users', users.create)

export default routes
