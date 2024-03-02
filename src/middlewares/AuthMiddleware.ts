import AuthService from '@/app/Auth/services/AuthService'
import { ACCESS_OPTIONS, REFRESH_OPTIONS } from '@/config/cookies'
import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies
  let id

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: 'Missing tokens.' })
  }

  try {
    const token = await AuthService.verifyRefreshToken(refreshToken)
    if (typeof token === 'object' && token !== null) id = token.id
  } catch (error) {
    res.clearCookie('refreshToken', REFRESH_OPTIONS)
    res.clearCookie('accessToken', REFRESH_OPTIONS)
    return res.status(403).send({ error: 'The refresh token has expired, please log in.' })
  }

  try {
    const token = await AuthService.verifyAccessToken(accessToken)
    if (typeof token === 'object' && token !== null) {
      if (token.id !== id) throw new JsonWebTokenError('Invalid token.')
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        const decoded = await AuthService.createAccessToken(id)
        res.cookie('accessToken', decoded, ACCESS_OPTIONS)
      }
    } else {
      res.clearCookie('refreshToken', REFRESH_OPTIONS)
      res.clearCookie('accessToken', REFRESH_OPTIONS)
      return res.status(403).send({ error: 'Suspicious activity detected.' })
    }
  }

  return next()
}
