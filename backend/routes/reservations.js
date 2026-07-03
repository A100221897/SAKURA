import { z } from 'zod'
import { db } from '../db.js'

const ReservationSchema = z.object({
  name:       z.string().min(1, 'El nombre es requerido'),
  email:      z.string().email('Email inválido'),
  date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser YYYY-MM-DD'),
  time:       z.string().regex(/^\d{2}:\d{2}$/, 'Hora debe ser HH:MM'),
  party_size: z.number().int().min(1).max(20)
})

const checkNumber = db.prepare('SELECT id FROM reservations WHERE reservation_number = ?')
const insert = db.prepare(
  'INSERT INTO reservations (reservation_number, name, email, date, time, party_size) VALUES (?, ?, ?, ?, ?, ?)'
)
const findByNumber = db.prepare(
  'SELECT reservation_number, name, date, time, party_size FROM reservations WHERE reservation_number = ?'
)

function uniqueRandomNumber() {
  for (let i = 0; i < 50; i++) {
    const num = Math.floor(Math.random() * 1000) + 1
    if (!checkNumber.get(num)) return num
  }
  throw new Error('No hay números de reservación disponibles')
}

export default async function reservationsRoutes(app) {
  app.post('/reservations', async (request, reply) => {
    const result = ReservationSchema.safeParse(request.body)
    if (!result.success) {
      return reply.code(400).send({ ok: false, error: result.error.issues[0].message })
    }

    const { name, email, date, time, party_size } = result.data
    const reservation_number = uniqueRandomNumber()
    insert.run(reservation_number, name, email, date, time, party_size)

    return reply.code(201).send({
      ok: true,
      reservation_number,
      message: `¡Reservación confirmada! Tu número de reservación es ${reservation_number}.`
    })
  })

  app.get('/reservations/:numero', (request, reply) => {
    const numero = parseInt(request.params.numero)
    if (isNaN(numero) || numero < 1 || numero > 1000) {
      return reply.code(400).send({ ok: false, error: 'Número de reservación inválido' })
    }
    const reservation = findByNumber.get(numero)
    if (!reservation) {
      return reply.code(404).send({ ok: false, error: 'Reservación no encontrada' })
    }
    return { ok: true, reservation }
  })
}
