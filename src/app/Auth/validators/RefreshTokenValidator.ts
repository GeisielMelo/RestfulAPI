import { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) return res.status(204).send({ error: 'Refresh token not found.' })

  return next()
}
