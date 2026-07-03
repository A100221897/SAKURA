import Fastify from 'fastify'
import cors from '@fastify/cors'
import menuRoutes from './routes/menu.js'
import reservationsRoutes from './routes/reservations.js'

const app = Fastify({ logger: false })

await app.register(cors, { origin: true })
await app.register(menuRoutes, { prefix: '/api' })
await app.register(reservationsRoutes, { prefix: '/api' })

await app.listen({ port: 3000, host: '0.0.0.0' })
console.log('Sakura backend running on :3000')
