import bcrypt from 'bcryptjs'
import UserError from '../../User/exceptions/UserError'

export default async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (error) {
    throw new UserError('Error generating password hash.')
  }
}
