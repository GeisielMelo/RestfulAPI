import { Router } from 'express'
import users from '../User/controllers/UsersController'

const routes = Router()

routes.get('/api/users/:id', users.show)

routes.post('/api/users', users.create)

export default routes
