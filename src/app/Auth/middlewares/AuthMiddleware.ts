import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/AuthService'
import AuthError from '../exceptions/AuthError'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) return res.status(401).json({ error: 'No token provided' })

  const [, token] = authorization.split(' ')

  try {
    await new AuthService().validateToken(token)
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).send()
    }

    return res.status(500).json({ error })
  }
  return next()
}
