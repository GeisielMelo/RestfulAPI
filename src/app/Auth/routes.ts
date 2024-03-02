import { Router } from 'express'
import auth from './controllers/AuthController'
import AuthMiddleware from '../../middlewares/AuthMiddleware'
import RefreshTokenValidator from './validators/RefreshTokenValidator'

const routes = Router()

routes.post('/api/auth/sign-in', auth.create)
routes.delete('/api/auth/sign-out', auth.delete)

routes.get('/api/auth/jwt', RefreshTokenValidator, auth.update)

// TODO Remove this function.
routes.get('/api/auth/test', AuthMiddleware, auth.test)

export default routes
