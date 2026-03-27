import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Env } from '../[[route]]'
import { signJwt, requireAuth, generateOtp, sendOtpEmail, verifyJwt } from '../lib/auth'

export const authRoutes = new Hono<{ Bindings: Env }>()

// Send OTP
authRoutes.post('/send-otp', zValidator('json', z.object({ email: z.string().email() })), async (c) => {
  const { email } = c.req.valid('json')
  const db = c.env.DB

  // Check whitelist
  const whitelistEnabled = await db.prepare('SELECT value FROM site_settings WHERE key = ?').bind('otp_whitelist_enabled').first<{ value: string }>()
  if (whitelistEnabled?.value === 'true') {
    const allowed = await db.prepare('SELECT id FROM email_whitelist WHERE email = ?').bind(email.toLowerCase()).first()
    if (!allowed) return c.json({ error: 'Email not authorised. Please contact the administrator.' }, 403)
  }

  // Rate limiting: max 5 per hour
  const now = new Date().toISOString()
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const rateLimit = await db.prepare('SELECT attempt_count, window_start FROM otp_rate_limits WHERE email = ?').bind(email).first<{ attempt_count: number; window_start: string }>()

  if (rateLimit) {
    if (rateLimit.window_start > oneHourAgo && rateLimit.attempt_count >= 5) {
      return c.json({ error: 'Too many attempts. Please try again in an hour.' }, 429)
    }
    if (rateLimit.window_start <= oneHourAgo) {
      await db.prepare('UPDATE otp_rate_limits SET attempt_count = 1, window_start = ? WHERE email = ?').bind(now, email).run()
    } else {
      await db.prepare('UPDATE otp_rate_limits SET attempt_count = attempt_count + 1 WHERE email = ?').bind(email).run()
    }
  } else {
    await db.prepare('INSERT INTO otp_rate_limits (email, attempt_count, window_start) VALUES (?, 1, ?)').bind(email, now).run()
  }

  // Generate and store OTP
  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 600000).toISOString()
  await db.prepare('INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)').bind(email, code, expiresAt).run()

  // Send email
  await sendOtpEmail(email, code, c.env)

  return c.json({ success: true, message: 'OTP sent to your email.' })
})

// Verify OTP
authRoutes.post('/verify-otp', zValidator('json', z.object({ email: z.string().email(), code: z.string().length(6) })), async (c) => {
  const { email, code } = c.req.valid('json')
  const db = c.env.DB

  const otpRecord = await db.prepare(
    'SELECT id, expires_at, used FROM otp_codes WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(email, code).first<{ id: number; expires_at: string; used: number }>()

  if (!otpRecord) return c.json({ error: 'Invalid OTP code.' }, 401)
  if (otpRecord.used) return c.json({ error: 'OTP already used.' }, 401)
  if (new Date(otpRecord.expires_at) < new Date()) return c.json({ error: 'OTP expired.' }, 401)

  // Mark used
  await db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').bind(otpRecord.id).run()

  // Upsert user
  await db.prepare('INSERT OR IGNORE INTO users (email, role) VALUES (?, ?)').bind(email, 'admin').run()
  const user = await db.prepare('SELECT id, email, name, role FROM users WHERE email = ?').bind(email).first<{ id: number; email: string; name: string; role: string }>()

  // Sign JWT (7 days)
  const token = await signJwt({ id: user!.id, email: user!.email, role: user!.role, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env)

  const response = c.json({ success: true, user: { id: user!.id, email: user!.email, name: user!.name, role: user!.role } })
  c.header('Set-Cookie', `lc_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)
  return response
})

// Get current user
authRoutes.get('/me', requireAuth, async (c) => {
  const user = c.get('user') as { email: string }
  const dbUser = await c.env.DB.prepare('SELECT id, email, name, role FROM users WHERE email = ?').bind(user.email).first()
  if (!dbUser) return c.json({ error: 'User not found' }, 404)
  return c.json({ user: dbUser })
})

// Logout
authRoutes.post('/logout', (c) => {
  c.header('Set-Cookie', 'lc_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
  return c.json({ success: true })
})
