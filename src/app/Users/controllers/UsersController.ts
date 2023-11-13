import { Request, Response } from 'express'

class UsersController {
  async index(req: Request, res: Response): Promise<Response> {
    const users = [{ id: '456', email: 'mod@mod.com' }]

    return res.status(200).json(users)
  }
}

export default new UsersController()
