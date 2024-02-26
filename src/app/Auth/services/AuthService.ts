import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../../config'
import database from '../../../database'
import AuthError from '../exceptions/AuthError'
import User from '../../../database/models/User'

interface ITokens {
  accessToken: string
  refreshToken: string
}
interface IRoles {
  User: number
  Editor: number
  Admin: number
}

export default class AuthService {
  async generateTokens(id: string, roles: IRoles): Promise<ITokens> {
    try {
      const accessToken = jwt.sign({ id, roles }, config.auth.secret.access, {
        expiresIn: config.auth.expiresIn.access,
      })

      const refreshToken = jwt.sign({ id }, config.auth.secret.refresh, {
        expiresIn: config.auth.expiresIn.refresh,
      })

      return { accessToken, refreshToken }
    } catch (error) {
      throw new AuthError('Error on generateTokens.')
    }
  }

  async validateAccessToken(token: string): Promise<string | JwtPayload> {
    return jwt.verify(token, config.auth.secret.access) as JwtPayload
  }

  async validateRefreshToken(refreshToken: string): Promise<string | JwtPayload> {
    try {
      await database.connect()
      const user = await User.findOne({ refreshToken })

      if (!user) throw new AuthError('User not found.')

      if (!user.refreshToken.length) throw new AuthError('Token not found.')

      user.refreshToken.forEach((element) => {
        if (element === refreshToken) return
        throw new AuthError("Token doesn't exists.")
      })

      return jwt.verify(refreshToken, config.auth.secret.refresh)
    } catch (error) {
      if (error instanceof AuthError) throw new AuthError(error.message)
      throw new AuthError('Error on validateRefreshToken.')
    } finally {
      await database.disconnect()
    }
  }

  async isRefreshTokenExpired(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, config.auth.secret.refresh) as JwtPayload
      return decoded.exp ? Date.now() >= new Date(decoded.exp * 1000).getTime() : false
    } catch {
      return true
    }
  }

  async isAccessTokenExpired(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, config.auth.secret.refresh) as JwtPayload
      return decoded.exp ? Date.now() >= new Date(decoded.exp * 1000).getTime() : false
    } catch {
      return true
    }
  }
}
