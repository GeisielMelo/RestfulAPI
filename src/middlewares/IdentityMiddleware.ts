import { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  if (!id) return res.status(400).json({ message: 'Id is required' })

  if (id) {
    const pattern = /^[0-9a-fA-F]{24}$/
    if (!pattern.test(id)) {
      return res.status(400).json({ message: 'Id is invalid' })
    }

    return next()
  }
}
