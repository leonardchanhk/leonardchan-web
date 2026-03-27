import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const speakingRoutes = new Hono<{ Bindings: Env }>()

speakingRoutes.get('/', async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM speaking WHERE published = 1 ORDER BY date DESC').all()
  return c.json({ speaking: items.results })
})

speakingRoutes.get('/admin/all', requireAuth, async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM speaking ORDER BY created_at DESC').all()
  return c.json({ speaking: items.results })
})

speakingRoutes.post('/', requireAuth, async (c) => {
  const data = await c.req.json()
  const now = new Date().toISOString()
  await c.env.DB.prepare(`INSERT INTO speaking (title_en,title_tc,title_sc,event_name,organizer,date,location,topic_en,topic_tc,topic_sc,description_en,description_tc,description_sc,image_url,video_url,published,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(data.title_en,data.title_tc||null,data.title_sc||null,data.event_name||null,data.organizer||null,data.date||null,data.location||null,data.topic_en||null,data.topic_tc||null,data.topic_sc||null,data.description_en||null,data.description_tc||null,data.description_sc||null,data.image_url||null,data.video_url||null,data.published||0,now).run()
  return c.json({ success: true })
})

speakingRoutes.put('/:id', requireAuth, async (c) => {
  const data = await c.req.json()
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
  await c.env.DB.prepare(`UPDATE speaking SET ${fields} WHERE id = ?`).bind(...Object.values(data), c.req.param('id')).run()
  return c.json({ success: true })
})

speakingRoutes.delete('/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM speaking WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
