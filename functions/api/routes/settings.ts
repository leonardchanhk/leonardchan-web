import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const settingsRoutes = new Hono<{ Bindings: Env }>()

// Public: get a specific setting
settingsRoutes.get('/:key', async (c) => {
  const setting = await c.env.DB.prepare('SELECT key, value FROM site_settings WHERE key = ?').bind(c.req.param('key')).first()
  if (!setting) return c.json({ error: 'Not found' }, 404)
  return c.json({ setting })
})

// Public: get multiple settings by prefix
settingsRoutes.get('/', async (c) => {
  const prefix = c.req.query('prefix') || ''
  const settings = await c.env.DB.prepare('SELECT key, value FROM site_settings WHERE key LIKE ?').bind(`${prefix}%`).all()
  return c.json({ settings: settings.results })
})

// Admin: upsert setting
settingsRoutes.put('/:key', requireAuth, async (c) => {
  const { key } = c.req.param()
  const { value } = await c.req.json()
  const user = c.get('user') as { email: string }
  const now = new Date().toISOString()

  const existing = await c.env.DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind(key).first<{ value: string }>()
  const oldValue = existing?.value || null

  await c.env.DB.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)').bind(key, value, now).run()

  // Log history
  await c.env.DB.prepare('INSERT INTO settings_history (setting_key, old_value, new_value, changed_by, created_at) VALUES (?, ?, ?, ?, ?)').bind(key, oldValue, value, user.email, now).run()

  // Audit log
  await c.env.DB.prepare('INSERT INTO audit_logs (user_email, action, entity_type, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(user.email, 'update', 'site_setting', key, JSON.stringify({ oldValue, newValue: value }), now).run()

  return c.json({ success: true })
})

// Admin: get settings history
settingsRoutes.get('/admin/history', requireAuth, async (c) => {
  const history = await c.env.DB.prepare('SELECT * FROM settings_history ORDER BY created_at DESC LIMIT 100').all()
  return c.json({ history: history.results })
})
