import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const projectsRoutes = new Hono<{ Bindings: Env }>()

projectsRoutes.get('/', async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC').all()
  return c.json({ projects: items.results })
})

projectsRoutes.get('/admin/all', requireAuth, async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all()
  return c.json({ projects: items.results })
})

projectsRoutes.post('/', requireAuth, async (c) => {
  const data = await c.req.json()
  const now = new Date().toISOString()
  await c.env.DB.prepare(`INSERT INTO projects (slug,title_en,title_tc,title_sc,description_en,description_tc,description_sc,category,status,url,image_url,sort_order,published,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(data.slug,data.title_en,data.title_tc||null,data.title_sc||null,data.description_en||null,data.description_tc||null,data.description_sc||null,data.category||null,data.status||'active',data.url||null,data.image_url||null,data.sort_order||0,data.published||0,now).run()
  return c.json({ success: true })
})

projectsRoutes.put('/:id', requireAuth, async (c) => {
  const data = await c.req.json()
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
  await c.env.DB.prepare(`UPDATE projects SET ${fields} WHERE id = ?`).bind(...Object.values(data), c.req.param('id')).run()
  return c.json({ success: true })
})

projectsRoutes.delete('/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
