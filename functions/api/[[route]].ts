import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRoutes } from './routes/auth'
import { articlesRoutes } from './routes/articles'
import { speakingRoutes } from './routes/speaking'
import { projectsRoutes } from './routes/projects'
import { organisationsRoutes } from './routes/organisations'
import { contactRoutes } from './routes/contact'
import { settingsRoutes } from './routes/settings'
import { analyticsRoutes } from './routes/analytics'
import { adminRoutes } from './routes/admin'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  JWT_SECRET?: string
  ENVIRONMENT?: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({
  origin: ['https://www.leonardchan.com', 'https://leonardchan.com', 'http://localhost:5173'],
  credentials: true,
}))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', site: 'leonardchan.com' }))

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/articles', articlesRoutes)
app.route('/api/speaking', speakingRoutes)
app.route('/api/projects', projectsRoutes)
app.route('/api/organisations', organisationsRoutes)
app.route('/api/contact', contactRoutes)
app.route('/api/settings', settingsRoutes)
app.route('/api/analytics', analyticsRoutes)
app.route('/api/admin', adminRoutes)

export const onRequest = handle(app)
