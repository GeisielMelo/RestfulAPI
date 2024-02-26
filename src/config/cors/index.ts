import origins from './origins'

const corsOptions = {
  credentials: true,
  origin: origins.origin,
  methods: 'GET,PUT,POST,DELETE',
  // allowedHeaders: 'Content-Type',
}

export default corsOptions
