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
    secret: {
      access: process.env.AUTH_ACCESS_TOKEN_SECRET || 'dev',
      refresh: process.env.AUTH_REFRESH_TOKEN_SECRET || 'dev',
    },
    expiresIn: {
      access: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
      refresh: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
}
