import express, { Application } from 'express'
import cors from 'cors'
import routes from './routes'

export default class App {
  app: Application

  constructor() {
    this.app = express()

    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`\x1b[32m[server] Server started on port \x1b[33m${port}\x1b[32m!\x1b[0m`)
    })
  }

  private middlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors())
  }

  private routes() {
    this.app.use(routes)
  }

  private exceptionHandler() {}
}
