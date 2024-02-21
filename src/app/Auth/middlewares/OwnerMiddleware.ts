import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/AuthService'
import AuthError from '../exceptions/AuthError'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { id } = req.params

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' })
  }

  if (!id) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authorization.replace('Bearer ', '')

  try {
    await new AuthService().validateTokenOwner(id, token)
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).send()
    }
    return res.status(500).json({ error })
  }
  return next()
}
