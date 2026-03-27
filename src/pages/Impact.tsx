import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from 'lucide-react'
import { useParallaxBg } from '../hooks/useParallax'

import { useModule } from '../hooks/useCmsData'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useSocialPosts() {
  const { items } = useModule('socialPosts')
  return items
}

function useProjects() {
  const { items } = useModule('projects')
  return items
}

// Platform accent colors
const PLATFORM_ACCENTS: Record<string, string> = {
  Facebook: 'text-blue-400',
  LinkedIn: 'text-blue-400',
  Twitter: 'text-sky-400',
  Instagram: 'text-pink-400',
  YouTube: 'text-red-400',
}

// Platform background gradients
const PLATFORM_BG: Record<string, string> = {
  Facebook: 'from-gray-900 via-gray-800 to-blue-900/30',
  LinkedIn: 'from-blue-950 via-blue-900 to-blue-800/50',
  Twitter: 'from-sky-950 via-sky-900/50 to-gray-950',
  Instagram: 'from-pink-950 via-purple-900/40 to-gray-950',
  YouTube: 'from-red-950 via-red-900/30 to-gray-950',
}

type Project = {
  id: number
  title: string
  subtitle: string
  year: string
  status: string
  description: string
  url: string
  photo_url?: string
  tags: string[]
  accent_color: string
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const { t } = useTranslation()
  return (
    <article className={`reveal card-lift bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 border-l-4 ${p.accent_color || 'border-blue-500/40'} flex flex-col`}>
      {/* 1:1 Photo */}
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {p.photo_url ? (
          <img src={p.photo_url} alt={`${p.title} — project photo`} className="w-full h-full object-cover" loading={i < 4 ? 'eager' : 'lazy'} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
              <ImageOff size={28} className="text-blue-400/50" />
            </div>
            <p className="text-xs text-gray-400 font-medium">{t('impact_page.photo_coming')}</p>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
            p.status === 'Active' ? 'bg-green-500 text-white' :
            p.status === 'Live' ? 'bg-blue-600 text-white' :
            p.status === 'Awarded' ? 'bg-purple-600 text-white' :
            p.status === 'Patented' ? 'bg-rose-600 text-white' :
            'bg-gray-600 text-white'
          }`}>{p.status}</span>
        </div>
        {p.url && p.url !== '#' && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.title}`}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-900/90 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
            <ExternalLink size={13} />
          </a>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-mono mb-1">{p.year}</p>
        <h3 className="font-brand font-bold text-gray-900 dark:text-white text-lg mb-0.5 leading-snug">{p.title}</h3>
        <p className="text-sm text-blue-600 font-semibold mb-3">{p.subtitle}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">{p.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {(p.tags || []).map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Impact() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  useReveal()
  const { ref: statsRef, bgPos: statsBgPos } = useParallaxBg(0.2)
  const { ref: communityRef, bgPos: communityBgPos } = useParallaxBg(0.2)

  const socialPosts = useSocialPosts()
  const projects = useProjects()

  const totalPosts = socialPosts.length
  const prev = () => setCurrent(c => (c - 1 + Math.max(totalPosts, 1)) % Math.max(totalPosts, 1))
  const next = () => setCurrent(c => (c + 1) % Math.max(totalPosts, 1))

  const post = socialPosts[current] || null

  return (
    <>
      {/* Full-screen social post hero */}
      <section
        className={`relative min-h-screen flex items-center bg-gradient-to-br ${post ? (PLATFORM_BG[post.platform] || 'from-gray-900 via-gray-800 to-blue-900/30') : 'from-gray-900 via-gray-800 to-blue-900/30'} transition-all duration-700`}
        aria-label="Featured social post"
        style={{ paddingTop: '4rem' }}
      >
        <div className="absolute inset-0 opacity-5">
          <img src="https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png" alt="" aria-hidden="true" className="w-full h-full object-cover object-right" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          {post ? (
            <>
              <div className="mb-6">
                <span className={`text-xs font-bold uppercase tracking-widest ${PLATFORM_ACCENTS[post.platform] || 'text-blue-400'}`}>{post.platform}</span>
                <span className="text-gray-500 mx-2">·</span>
                <span className="text-gray-400 text-xs">{post.post_date}</span>
              </div>

              <h2 className="font-brand font-bold text-white mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
                {post.title}
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-8">
                {post.content}
              </p>

              <div className="flex items-center gap-6 mb-10">
                {post.likes && <span className="text-sm text-gray-400">❤️ {post.likes}</span>}
                {post.shares && <span className="text-sm text-gray-400">🔁 {post.shares}</span>}
                {post.comments && <span className="text-sm text-gray-400">💬 {post.comments}</span>}
              </div>

              {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  {t('impact_page.view_on')} {post.platform} <ExternalLink size={14} />
                </a>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-center py-20">Loading...</div>
          )}
        </div>

        {/* Navigation */}
        {totalPosts > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-10">
            <button onClick={prev} aria-label="Previous post"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Post navigation">
              {socialPosts.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrent(i)} role="tab" aria-selected={i === current} aria-label={`Post ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-blue-500 w-6' : 'bg-white/30 hover:bg-white/50'}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Next post"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Stats */}
      <section ref={statsRef as React.RefObject<HTMLElement>} className="py-16 px-4 bg-gray-900 relative overflow-hidden" aria-label="Impact statistics">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px', backgroundPosition: statsBgPos }} aria-hidden="true" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '30+', label: t('impact_page.stat_years_tech') },
            { value: '100+', label: t('impact_page.stat_articles') },
            { value: '15+', label: t('impact_page.stat_active_roles') },
            { value: '15+', label: t('impact_page.stat_public_service') },
          ].map((s, i) => (
            <div key={i} className="reveal">
              <div className="font-brand font-bold text-blue-400 mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{s.value}</div>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="projects-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('impact_page.projects_label')}</p>
            <h2 id="projects-heading" className="section-title text-gray-900 dark:text-white">
              {t('impact_page.projects_title_1')} <span className="text-blue-600">{t('impact_page.projects_title_2')}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
              {t('impact_page.projects_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id || i} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Community roles */}
      <section ref={communityRef as React.RefObject<HTMLElement>} className="py-16 px-4 bg-gray-950 relative overflow-hidden" aria-labelledby="community-heading">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px', backgroundPosition: communityBgPos }} aria-hidden="true" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 reveal">
            <p className="section-label mb-2">{t('impact_page.community_label')}</p>
            <h2 id="community-heading" className="section-title text-white">
              {t('impact_page.community_title_1')} <span className="text-blue-400">{t('impact_page.community_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { role: t('impact_page.role_mentor'), org: t('impact_page.org_strive') },
              { role: t('impact_page.role_assessor'), org: t('impact_page.org_judiciary') },
              { role: t('impact_page.role_court'), org: t('impact_page.org_lingnan') },
              { role: t('impact_page.role_professor'), org: t('impact_page.org_cuc') },
              { role: t('impact_page.role_rotary'), org: t('impact_page.org_rotary') },
              { role: t('impact_page.role_judge'), org: t('impact_page.org_hkict') },
            ].map((r, i) => (
              <div key={i} className="reveal bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="font-bold text-white text-sm mb-0.5">{r.role}</h3>
                <p className="text-gray-400 text-xs">{r.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
