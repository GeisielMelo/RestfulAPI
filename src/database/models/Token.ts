import { Schema, Document, model } from 'mongoose'

interface IToken {
  token: string
  expireAt: Date
}

interface ITokenDocument extends IToken, Document {}

const tokenSchema = new Schema<ITokenDocument>(
  {
    token: { type: String, required: true },
    expireAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 Days
  },
  { timestamps: true },
)

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const Token = model<ITokenDocument>('Token', tokenSchema)
export default Token
