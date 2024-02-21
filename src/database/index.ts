import mongoose, { Connection } from 'mongoose'
import config from '../config'

class Database {
  connection!: Connection

  async connect() {
    try {
      if (this.connection && this.connection.readyState === 1) return
      await mongoose.connect(config.mongo.uri as string)
    } catch (error) {
      throw new Error('Database: Failed to connect.')
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
    } catch (error) {
      throw new Error('Database: Failed to disconnect.')
    }
  }
}

export default new Database()
