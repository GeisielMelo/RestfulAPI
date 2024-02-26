import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import corsOptions from './config/cors'

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
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cors(corsOptions))
    this.app.use(cookieParser())
  }

  private routes() {
    this.app.use(routes)
  }

  private exceptionHandler() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.message)
      next()
    })
  }
}
