import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const organisationsRoutes = new Hono<{ Bindings: Env }>()

organisationsRoutes.get('/', async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM organisations WHERE published = 1 ORDER BY sort_order ASC').all()
  return c.json({ organisations: items.results })
})

organisationsRoutes.get('/admin/all', requireAuth, async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM organisations ORDER BY sort_order ASC').all()
  return c.json({ organisations: items.results })
})

organisationsRoutes.post('/', requireAuth, async (c) => {
  const data = await c.req.json()
  const now = new Date().toISOString()
  await c.env.DB.prepare(`INSERT INTO organisations (slug,name_en,name_tc,name_sc,role_en,role_tc,role_sc,description_en,description_tc,description_sc,website_url,logo_url,category,sort_order,published,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(data.slug,data.name_en,data.name_tc||null,data.name_sc||null,data.role_en||null,data.role_tc||null,data.role_sc||null,data.description_en||null,data.description_tc||null,data.description_sc||null,data.website_url||null,data.logo_url||null,data.category||'advisory',data.sort_order||0,data.published||0,now).run()
  return c.json({ success: true })
})

organisationsRoutes.put('/:id', requireAuth, async (c) => {
  const data = await c.req.json()
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
  await c.env.DB.prepare(`UPDATE organisations SET ${fields} WHERE id = ?`).bind(...Object.values(data), c.req.param('id')).run()
  return c.json({ success: true })
})

organisationsRoutes.delete('/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM organisations WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
