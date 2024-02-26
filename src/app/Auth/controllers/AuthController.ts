import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import AuthError from '../exceptions/AuthError'
import database from '../../../database'
import User from '../../../database/models/User'
import decryptPassword from '../../Auth/services/PasswordService'
import { COOKIE_SET_OPTIONS, COOKIE_UNSET_OPTIONS } from '../../../config/cookies'

class AuthController {
  /**  Create Authorization. */
  async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    try {
      await database.connect()
      const user = await User.findOne({ email })
      if (!user) return res.status(404).send({ error: 'User not found' })

      const passwordDecrypted = await decryptPassword(password, user.password)
      if (!passwordDecrypted) return res.status(400).send({ error: 'Invalid credentials' })

      const { id, roles } = user
      const { accessToken, refreshToken } = await new AuthService().generateTokens(id, roles)

      user.refreshToken = [...[], refreshToken]
      await user.save()

      res.cookie('refreshToken', refreshToken, COOKIE_SET_OPTIONS)
      return res.status(200).send({ user: { id, roles }, token: accessToken })
    } catch (error) {
      console.log(error)
      if (error instanceof AuthError) return res.status(401).send({ error: error.message })
      return res.status(401).send({ error: 'Internal server error.' })
    } finally {
      await database.disconnect()
    }
  }

  /** Refresh Authorization. */
  async update(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(401).send({ error: 'Refresh token not found.' })
    res.clearCookie('refreshToken', COOKIE_UNSET_OPTIONS)

    try {
      await database.connect()
      const user = await User.findOne({ refreshToken })

      // Detected refresh token reuse
      if (!user) return res.status(403).send({ error: 'Suspicious activity detected' })

      const newRefreshTokenArray = user.refreshToken.filter((token) => token !== refreshToken)

      // Evaluate Token
      const expiredToken = await new AuthService().isRefreshTokenExpired(refreshToken)
      if (expiredToken) {
        user.refreshToken = [...newRefreshTokenArray]
        await user.save()
      } else {
        return res.status(403).send({ error: 'Suspicious activity detected' })
      }

      // Refresh token was still valid
      const { id, roles } = user
      const newTokens = await new AuthService().generateTokens(id, roles)

      // Saving refreshToken with current user
      user.refreshToken = [...newRefreshTokenArray, newTokens.refreshToken]
      await user.save()

      // Creates Secure Cookie with refresh token
      res.cookie('refreshToken', refreshToken, COOKIE_SET_OPTIONS)
      return res.status(200).send({ user: { id, roles }, token: newTokens.accessToken })
    } catch (error) {
      if (error instanceof AuthError) return res.status(401).send({ error: error.message })
      return res.status(401).send({ error: 'Internal server error.' })
    } finally {
      await database.disconnect()
    }
  }

  /** Delete Authorization. */
  async delete(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(204).send({ message: 'Logout successfully' })

    try {
      await database.connect()
      const user = await User.findOne({ refreshToken })

      if (user) {
        user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken)
        await user.save()
      }

      res.clearCookie('refreshToken', COOKIE_UNSET_OPTIONS)
      return res.status(204).send({ message: 'Logout successfully' })
    } catch (error) {
      if (error instanceof AuthError) return res.status(401).send({ error: error.message })
      return res.status(401).send({ error: 'Internal server error.' })
    } finally {
      await database.disconnect()
    }
  }

  // TODO Remove this function.
  async teste(req: Request, res: Response): Promise<Response> {
    return res.send('teste')
  }
}

export default new AuthController()
