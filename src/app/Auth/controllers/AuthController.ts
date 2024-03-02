import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import AuthError from '../exceptions/AuthError'
import database from '../../../database'
import User from '../../../database/models/User'
import decryptPassword from '../../Auth/services/PasswordService'
import { REFRESH_OPTIONS, ACCESS_OPTIONS, UNSET_OPTIONS } from '../../../config/cookies'

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

      const accessToken = await AuthService.createAccessToken(user.id)
      const refreshToken = await AuthService.createRefreshToken(user.id)

      user.refreshToken = [...[], refreshToken]
      await user.save()

      res.cookie('accessToken', accessToken, ACCESS_OPTIONS)
      res.cookie('refreshToken', refreshToken, REFRESH_OPTIONS)
      return res.status(200).send({ id: user.id, email: user.email })
    } catch (error) {
      if (error instanceof AuthError) return res.status(401).send({ error: error.message })
      return res.status(401).send({ error: 'Internal server error.' })
    } finally {
      await database.disconnect()
    }
  }

  /** Refresh Authorization. */
  async update(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies

    try {
      await database.connect()
      const user = await User.findOne({ refreshToken })

      // Detected registered refresh token.
      if (!user) {
        res.clearCookie('refreshToken', REFRESH_OPTIONS)
        return res.status(403).send({ error: 'Suspicious activity detected.' })
      }

      const newRefreshTokenArray = user.refreshToken.filter((token) => token !== refreshToken)

      // Evaluate Token
      const expiredToken = await AuthService.isRefreshTokenExpired(refreshToken)
      if (expiredToken) {
        user.refreshToken = [...newRefreshTokenArray]
        await user.save()
        res.clearCookie('refreshToken', UNSET_OPTIONS)
        return res.status(403).send({ error: 'The refresh token has expired, please log in.' })
      }

      // Refresh token still valid.
      const accessToken = await AuthService.createAccessToken(user.id)

      // Creates Secure Cookie with refresh token
      res.cookie('accessToken', accessToken, ACCESS_OPTIONS)
      return res.status(200).send({ id: user.id, email: user.email })
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
    if (!refreshToken) return res.status(20).send({ message: 'Logout successfully' })

    try {
      await database.connect()
      const user = await User.findOne({ refreshToken })

      if (user) {
        user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken)
        await user.save()
      }

      res.clearCookie('accessToken', UNSET_OPTIONS)
      res.clearCookie('refreshToken', UNSET_OPTIONS)
      return res.status(200).send({ message: 'Logout successfully' })
    } catch (error) {
      if (error instanceof AuthError) return res.status(401).send({ error: error.message })
      return res.status(401).send({ error: 'Internal server error.' })
    } finally {
      await database.disconnect()
    }
  }

  // TODO Remove this function.
  async test(req: Request, res: Response): Promise<Response> {
    return res.status(200).send({ message: 'OK' })
  }
}

export default new AuthController()
