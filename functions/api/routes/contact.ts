import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const contactRoutes = new Hono<{ Bindings: Env }>()

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  organization: z.string().max(100).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  lang: z.string().default('en'),
})

contactRoutes.post('/', zValidator('json', contactSchema), async (c) => {
  const data = c.req.valid('json')
  const now = new Date().toISOString()
  await c.env.DB.prepare(`INSERT INTO contact_submissions (name,email,organization,subject,message,lang,created_at) VALUES (?,?,?,?,?,?,?)`)
    .bind(data.name, data.email, data.organization || null, data.subject, data.message, data.lang, now).run()
  return c.json({ success: true, message: 'Your message has been received. Leonard will be in touch shortly.' })
})

contactRoutes.get('/admin/all', requireAuth, async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all()
  return c.json({ submissions: items.results })
})

contactRoutes.put('/admin/:id/read', requireAuth, async (c) => {
  await c.env.DB.prepare('UPDATE contact_submissions SET is_read = 1 WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

contactRoutes.delete('/admin/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM contact_submissions WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
