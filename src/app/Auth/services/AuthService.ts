import jwt from 'jsonwebtoken'
import AuthError from '../exceptions/AuthError'
import config from '../../../config'
import database from '../../../database'
import User from '../../../database/models/User'
import Token from '../../../database/models/Token'
import decryptPassword from '../../Auth/services/PasswordService'

export default class AuthService {
  async signIn(email: string, password: string): Promise<{ user: object; token: string }> {
    try {
      await database.connect()
      const user = await User.findOne({ email })

      if (!user) {
        throw new AuthError('User not found')
      }

      const passwordDecrypted = await decryptPassword(password, user.password)

      if (!passwordDecrypted) {
        throw new AuthError('Invalid credentials')
      }

      const { id } = user

      // Generate token
      const token = jwt.sign({ id }, config.auth.secret, {
        expiresIn: config.auth.expiresIn,
      })

      return { user: { id, email }, token }
    } finally {
      await database.disconnect()
    }
  }

  async signOut(token: string) {
    await this.blacklistToken(token)
  }

  async validateTokenOwner(id: string, token: string): Promise<void> {
    try {
      const userDecoded = jwt.verify(token, config.auth.secret) as {
        id: string
      }

      if (userDecoded.id !== id) {
        throw new AuthError('Invalid token owner.')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      } else {
        throw new AuthError('Error on validate token owner.')
      }
    }
  }

  async validateToken(token: string): Promise<void> {
    try {
      if (await this.isTokenBlacklisted(token)) {
        throw new Error('Token was blacklisted.')
      }

      if (await this.isTokenExpired(token)) {
        throw new Error('Token expired.')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message)
      } else {
        throw new AuthError('Error on validate token.')
      }
    }
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      await database.connect()
      const blacklistedToken = await Token.findOne({ token })
      return !!blacklistedToken
    } catch (error) {
      throw new AuthError('Error on blacklisted token.')
    } finally {
      await database.disconnect()
    }
  }

  private async blacklistToken(token: string): Promise<void> {
    try {
      await database.connect()
      await Token.create({ token })
    } catch (error) {
      throw new AuthError('Error on blacklist token.')
    } finally {
      await database.disconnect()
    }
  }

  private async isTokenExpired(token: string): Promise<boolean> {
    const decoded = jwt.verify(token, config.auth.secret) as { exp: number }
    return decoded.exp < Math.floor(Date.now() / 1000)
  }
}
