import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const articlesRoutes = new Hono<{ Bindings: Env }>()

// Public: list published articles
articlesRoutes.get('/', async (c) => {
  const category = c.req.query('category')
  const featured = c.req.query('featured')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = parseInt(c.req.query('offset') || '0')

  let query = 'SELECT * FROM articles WHERE published = 1'
  const params: (string | number)[] = []
  if (category) { query += ' AND category = ?'; params.push(category) }
  if (featured === '1') { query += ' AND featured = 1' }
  query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const articles = await c.env.DB.prepare(query).bind(...params).all()
  return c.json({ articles: articles.results })
})

// Public: single article
articlesRoutes.get('/:slug', async (c) => {
  const article = await c.env.DB.prepare('SELECT * FROM articles WHERE slug = ? AND published = 1').bind(c.req.param('slug')).first()
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ article })
})

// Admin: list all articles
articlesRoutes.get('/admin/all', requireAuth, async (c) => {
  const articles = await c.env.DB.prepare('SELECT * FROM articles ORDER BY created_at DESC').all()
  return c.json({ articles: articles.results })
})

const articleSchema = z.object({
  slug: z.string().min(1),
  title_en: z.string().min(1),
  title_tc: z.string().optional(),
  title_sc: z.string().optional(),
  excerpt_en: z.string().optional(),
  excerpt_tc: z.string().optional(),
  excerpt_sc: z.string().optional(),
  content_en: z.string().optional(),
  content_tc: z.string().optional(),
  content_sc: z.string().optional(),
  category: z.string().default('insights'),
  tags: z.string().optional(),
  cover_image: z.string().optional(),
  external_url: z.string().optional(),
  published: z.number().default(0),
  featured: z.number().default(0),
  published_at: z.string().optional(),
})

// Admin: create article
articlesRoutes.post('/', requireAuth, zValidator('json', articleSchema), async (c) => {
  const data = c.req.valid('json')
  const now = new Date().toISOString()
  await c.env.DB.prepare(`INSERT INTO articles (slug,title_en,title_tc,title_sc,excerpt_en,excerpt_tc,excerpt_sc,content_en,content_tc,content_sc,category,tags,cover_image,external_url,published,featured,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(data.slug,data.title_en,data.title_tc||null,data.title_sc||null,data.excerpt_en||null,data.excerpt_tc||null,data.excerpt_sc||null,data.content_en||null,data.content_tc||null,data.content_sc||null,data.category,data.tags||null,data.cover_image||null,data.external_url||null,data.published,data.featured,data.published_at||now,now,now).run()
  return c.json({ success: true })
})

// Admin: update article
articlesRoutes.put('/:id', requireAuth, zValidator('json', articleSchema.partial()), async (c) => {
  const data = c.req.valid('json')
  const now = new Date().toISOString()
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
  const values = [...Object.values(data), now, c.req.param('id')]
  await c.env.DB.prepare(`UPDATE articles SET ${fields}, updated_at = ? WHERE id = ?`).bind(...values).run()
  return c.json({ success: true })
})

// Admin: delete article
articlesRoutes.delete('/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})
