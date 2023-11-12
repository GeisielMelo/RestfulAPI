import { Router } from 'express'
import auth from './controllers/AuthController'

const routes = Router()

routes.post('/auth/sign-in', auth.create)

export default routes
