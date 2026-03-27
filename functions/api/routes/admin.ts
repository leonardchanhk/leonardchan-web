import { Hono } from 'hono'
import { Env } from '../[[route]]'
import { requireAuth } from '../lib/auth'

export const adminRoutes = new Hono<{ Bindings: Env }>()

// Users list
adminRoutes.get('/users', requireAuth, async (c) => {
  const users = await c.env.DB.prepare('SELECT id, email, name, role, otp_enabled, created_at FROM users ORDER BY created_at DESC').all()
  return c.json({ users: users.results })
})

// Update user role
adminRoutes.put('/users/:id/role', requireAuth, async (c) => {
  const { role } = await c.req.json()
  const user = c.get('user') as { email: string; role: string }
  if (user.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403)
  await c.env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, c.req.param('id')).run()
  const now = new Date().toISOString()
  await c.env.DB.prepare('INSERT INTO audit_logs (user_email, action, entity_type, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(user.email, 'update', 'user_role', c.req.param('id'), JSON.stringify({ role }), now).run()
  return c.json({ success: true })
})

// Whitelist
adminRoutes.get('/whitelist', requireAuth, async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM email_whitelist ORDER BY created_at DESC').all()
  return c.json({ whitelist: items.results })
})

adminRoutes.post('/whitelist', requireAuth, async (c) => {
  const { email } = await c.req.json()
  const user = c.get('user') as { email: string }
  const now = new Date().toISOString()
  await c.env.DB.prepare('INSERT OR IGNORE INTO email_whitelist (email, added_by, created_at) VALUES (?, ?, ?)').bind(email.toLowerCase(), user.email, now).run()
  return c.json({ success: true })
})

adminRoutes.delete('/whitelist/:id', requireAuth, async (c) => {
  await c.env.DB.prepare('DELETE FROM email_whitelist WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})

// Audit logs
adminRoutes.get('/audit', requireAuth, async (c) => {
  const logs = await c.env.DB.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200').all()
  return c.json({ logs: logs.results })
})
