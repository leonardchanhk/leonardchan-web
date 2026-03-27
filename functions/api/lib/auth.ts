import { Context, Next } from 'hono'
import { Env } from '../[[route]]'

const JWT_SECRET_DEFAULT = 'leonardchan-jwt-secret-change-in-production'

export async function getJwtSecret(env: Env): Promise<CryptoKey> {
  const secret = env.JWT_SECRET || JWT_SECRET_DEFAULT
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signJwt(payload: Record<string, unknown>, env: Env): Promise<string> {
  const key = await getJwtSecret(env)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }))
  const data = `${header}.${body}`
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return `${data}.${sigB64}`
}

export async function verifyJwt(token: string, env: Env): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const key = await getJwtSecret(env)
    const data = `${parts[0]}.${parts[1]}`
    const sig = parts[2].replace(/-/g, '+').replace(/_/g, '/')
    const sigBytes = Uint8Array.from(atob(sig + '=='.slice((sig.length + 3) % 4 === 0 ? 0 : (4 - (sig.length % 4)) % 4)), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
    if (!valid) return null
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function requireAuth(c: Context, next: Next) {
  const cookie = c.req.header('Cookie') || ''
  const tokenMatch = cookie.match(/lc_token=([^;]+)/)
  const token = tokenMatch?.[1] || c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
  const payload = await verifyJwt(token, c.env as Env)
  if (!payload) return c.json({ error: 'Invalid or expired token' }, 401)
  c.set('user', payload)
  await next()
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtpEmail(email: string, code: string, env: Env): Promise<boolean> {
  // In production, integrate with Mailchannels (free on Cloudflare Workers) or Resend
  // For now, log to KV for development
  await env.KV.put(`otp_debug_${email}`, code, { expirationTtl: 600 })
  console.log(`OTP for ${email}: ${code}`)
  return true
}
