import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import config from '../../../config'
import AuthError from '../exceptions/AuthError'

class AuthService {
  async createAccessToken(id: string): Promise<string> {
    try {
      return jwt.sign({ id }, config.auth.secret.access, {
        expiresIn: config.auth.expiresIn.access,
      })
    } catch (error) {
      throw new AuthError('Error on access token creation.')
    }
  }

  async createRefreshToken(id: string): Promise<string> {
    try {
      return jwt.sign({ id }, config.auth.secret.refresh, {
        expiresIn: config.auth.expiresIn.refresh,
      })
    } catch (error) {
      throw new AuthError('Error on refresh token creation.')
    }
  }

  async verifyAccessToken(token: string): Promise<string | JwtPayload> {
    return jwt.verify(token, config.auth.secret.access) as JwtPayload
  }

  async verifyRefreshToken(refreshToken: string): Promise<string | JwtPayload> {
    return jwt.verify(refreshToken, config.auth.secret.refresh)
  }

  async isRefreshTokenExpired(token: string): Promise<boolean> {
    try {
      this.verifyRefreshToken(token)
      return false
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError') {
          return true
        }
      }
      return true
    }
  }

  async isAccessTokenExpired(token: string): Promise<boolean> {
    try {
      this.verifyAccessToken(token)
      return false
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError') {
          return true
        }
      }
      return true
    }
  }
}

export default new AuthService()
