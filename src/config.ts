import dotenv from 'dotenv'

dotenv.config()

export default {
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production') || 'production',
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'dev',
    expiresIn: process.env.AUTH_EXPIRES_IN || '7d',
  },
}
