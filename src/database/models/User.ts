import { Schema, Document, model } from 'mongoose'

interface IUser {
  email: string
  password: string
}

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const User = model<IUserDocument>('User', userSchema)
export default User
