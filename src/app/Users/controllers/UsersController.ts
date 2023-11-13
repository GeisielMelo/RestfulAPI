import { Request, Response } from 'express'

class UsersController {
  async index(req: Request, res: Response): Promise<Response> {
    const users = [{ id: '456', email: 'mod@mod.com' }]

    return res.status(200).json(users)
  }

  async message(req: Request, res: Response): Promise<Response> {
    const { message } = req.body
    return res.status(200).json({ message })
  }
}

export default new UsersController()
