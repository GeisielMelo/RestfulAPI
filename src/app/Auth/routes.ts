import { Router } from 'express'
import auth from './controllers/AuthController'

const routes = Router()

routes.post('/api/auth/sign-in', auth.create)
routes.delete('/api/auth/sign-out', auth.destroy)

export default routes
