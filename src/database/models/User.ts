import { Schema, Document, model } from 'mongoose'

interface IUser {
  email: string
  password: string
  roles: {
    User: number
    Editor: number
    Admin: number
  }
  refreshToken: string[]
}

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    refreshToken: { type: [String] },
    roles: {
      User: { type: Number, default: 2001 },
      Editor: { type: Number },
      Admin: { type: Number },
    },
  },
  {
    timestamps: true,
  },
)

const User = model<IUserDocument>('User', userSchema)
export default User
