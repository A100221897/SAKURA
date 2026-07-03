import { db } from '../db.js'

export default async function menuRoutes(app) {
  app.get('/menu', () => {
    const menu = db.prepare('SELECT * FROM menu_items ORDER BY category, id').all()
    return { ok: true, menu }
  })
}
