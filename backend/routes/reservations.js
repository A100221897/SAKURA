import { z } from 'zod'
import { db } from '../db.js'

const ReservationSchema = z.object({
  name:       z.string().min(1, 'name is required'),
  email:      z.string().email('invalid email'),
  date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  time:       z.string().regex(/^\d{2}:\d{2}$/, 'time must be HH:MM'),
  party_size: z.number().int().min(1).max(20)
})

const insert = db.prepare(
  'INSERT INTO reservations (name, email, date, time, party_size) VALUES (?, ?, ?, ?, ?)'
)

export default async function reservationsRoutes(app) {
  app.post('/reservations', async (request, reply) => {
    const result = ReservationSchema.safeParse(request.body)
    if (!result.success) {
      return reply.code(400).send({
        ok: false,
        error: result.error.issues[0].message
      })
    }

    const { name, email, date, time, party_size } = result.data
    const { lastInsertRowid } = insert.run(name, email, date, time, party_size)

    return reply.code(201).send({
      ok: true,
      confirmation_id: `RES-${lastInsertRowid}`,
      message: `Your table is reserved. See you on ${date} at ${time}!`
    })
  })
}
