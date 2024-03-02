import { Schema, Document, model } from 'mongoose'

interface IUser {
  email: string
  password: string
  refreshToken: string[]
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    refreshToken: { type: [String] },
  },
  {
    timestamps: true,
  },
)

const User = model<IUserDocument>('User', userSchema)
export default User
