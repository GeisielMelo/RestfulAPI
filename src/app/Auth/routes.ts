import { Router } from 'express'
import auth from './controllers/AuthController'

const routes = Router()

routes.post('/auth/sign-in', auth.create)
routes.delete('/auth/sign-out', auth.destroy)

export default routes
