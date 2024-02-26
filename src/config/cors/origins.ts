import { CorsOptions } from 'cors'

import domains from './domains'

type CorsOriginCallback = (error: Error | null, allow: boolean) => void

const origins: CorsOptions = {
  origin: (origin: string | undefined, callback: CorsOriginCallback) => {
    if (!origin || domains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  optionsSuccessStatus: 200,
}

export default origins
