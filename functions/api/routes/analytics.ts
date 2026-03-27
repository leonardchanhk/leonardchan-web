import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const analyticsRoutes = new Hono<{ Bindings: Env }>()

// Track page view (public)
analyticsRoutes.post('/track', async (c) => {
  const { path, referrer } = await c.req.json()
  const country = c.req.header('CF-IPCountry') || null
  const now = new Date().toISOString()
  await c.env.DB.prepare('INSERT INTO page_views (path, referrer, country, created_at) VALUES (?, ?, ?, ?)').bind(path, referrer || null, country, now).run()
  return c.json({ success: true })
})

// Admin: get analytics
analyticsRoutes.get('/admin/summary', requireAuth, async (c) => {
  const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM page_views').first<{ count: number }>()
  const today = await c.env.DB.prepare("SELECT COUNT(*) as count FROM page_views WHERE created_at >= date('now')").first<{ count: number }>()
  const topPages = await c.env.DB.prepare('SELECT path, COUNT(*) as views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 10').all()
  const topCountries = await c.env.DB.prepare('SELECT country, COUNT(*) as views FROM page_views WHERE country IS NOT NULL GROUP BY country ORDER BY views DESC LIMIT 10').all()
  return c.json({ total: total?.count || 0, today: today?.count || 0, topPages: topPages.results, topCountries: topCountries.results })
})
