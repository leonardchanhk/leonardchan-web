import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Award, BookOpen, Mic, Users, ChevronDown, FlaskConical, Tv, Trophy, Scale, Globe, Globe2, Target, GraduationCap, Building2 } from 'lucide-react'

import { useParallaxBg } from '../hooks/useParallax'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'

import { useModule } from '../hooks/useCmsData'
function useSiteStats() {
  const { items } = useModule('siteStats')
  return items
}

// Particle canvas hook
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59,130,246,0.6)'
        ctx.fill()
      })
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(59,130,246,${0.2 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

// Scroll reveal hook — handles .reveal, .reveal-scale, .reveal-left, .reveal-right
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// Counter animation hook
function useCounter(target: number, start: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 25)
    return () => clearInterval(timer)
  }, [target, start])
  return count
}

type StatItem = { key: string; value: number; suffix: string; icon: any }
function StatCounter({ stat, visible, label }: { stat: StatItem, visible: boolean, label: string }) {
  const count = useCounter(stat.value, visible)
  return (
    <div className="text-center">
      <div className="font-brand font-bold text-blue-400 mb-1"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
        {count}{stat.suffix}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

const STATS_FALLBACK = [
  { key: 'stat_years', value: 30, suffix: '+', icon: Award },
  { key: 'stat_articles', value: 100, suffix: '+', icon: BookOpen },
  { key: 'stat_roles', value: 20, suffix: '+', icon: Users },
  { key: 'stat_patents', value: 15, suffix: '+', icon: Mic },
]

const FORMULA_KEYS = [
  { key: 'ai', color: 'from-blue-600/20 to-blue-700/10', border: 'border-blue-600/30' },
  { key: 'ind', color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/30' },
  { key: 'gba', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30' },
]

const ACHIEVEMENT_KEYS = [
  { key: 'patent', Icon: FlaskConical, year: '2001', color: 'from-violet-700 via-purple-600 to-indigo-700', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
  { key: 'tvc', Icon: Tv, year: '2000s', color: 'from-blue-700 via-sky-600 to-cyan-700', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80' },
  { key: 'apicta', Icon: Trophy, year: '2011', color: 'from-blue-800 via-blue-600 to-indigo-700', img: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80' },
  { key: 'judging', Icon: Scale, year: '2013', color: 'from-indigo-700 via-blue-600 to-sky-700', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { key: 'prove', Icon: Globe, year: '2015', color: 'from-sky-700 via-blue-600 to-indigo-700', img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80' },
  { key: 'un', Icon: Globe2, year: '2016', color: 'from-blue-700 via-indigo-600 to-violet-700', img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80' },
]

export default function Home() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const cmsStats = useSiteStats()

  // Parallax for mid-page dark sections
  const { ref: parallaxOpportRef, bgPos: opportunitiesBgPos } = useParallaxBg(0.25)
  const { ref: parallaxFormulasRef, bgPos: formulasBgPos } = useParallaxBg(0.2)

  useParticles(canvasRef)
  useReveal()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])


  return (
    <>
      {/* ===== HERO ===== */}
      <section
        aria-label="Hero"
        className="relative min-h-screen flex items-center overflow-hidden bg-gray-950"
        style={{ paddingTop: '4rem' }}
      >
        {/* Background portrait photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png"
            alt="Leonard Chan, MH — Technology Innovator and Policy Advocate"
            className="w-full h-full object-cover opacity-60"
            style={{ objectPosition: '65% 15%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
        </div>

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-fade-in mb-6">
              <span className="medal-badge animate-pulse-glow">
                <Award size={12} />
                {t('hero.badge')}
              </span>
            </div>

            {/* Chinese name */}
            <p className="animate-fade-in delay-100 text-blue-400/70 font-brand text-2xl mb-1">
              {t('hero.chinese_name')}
            </p>

             {/* English name */}
            <h1 className="animate-fade-in delay-200 font-brand font-bold leading-none mb-4"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              <span className="text-white">{t('hero.name').split(' ')[0]} </span>
              <span className="text-shimmer">{t('hero.name').split(' ').slice(1).join(' ')}</span>
            </h1>
            {/* Tagline */}
            <p className="animate-fade-in delay-300 text-blue-400 font-semibold text-lg sm:text-xl mb-4 tracking-wide text-neon">
              {t('hero.tagline')}
            </p>
            {/* Subtitle */}
            <p className="animate-slide-up-blur delay-400 text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Credential chips */}
            <div className="animate-fade-in delay-400 flex flex-wrap gap-2 mb-10">
              {['credential_airdi', 'credential_hkirc', 'credential_tia', 'credential_tagdigital', 'credential_mh', 'credential_un'].map(key => (
                <span key={key} className="px-3 py-1 text-xs font-semibold border border-blue-600/40 text-blue-300 rounded-full bg-blue-600/10">
                  {t(`hero.${key}`)}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="animate-fade-in delay-500 flex flex-wrap gap-4">
              <MagneticButton as="div" strength={0.4}>
                <Link to="/insights" className="btn-primary">
                  {t('hero.cta_insights')} <ArrowRight size={16} />
                </Link>
              </MagneticButton>
              <MagneticButton as="div" strength={0.4}>
                <Link to="/speaking" className="btn-outline">
                  {t('hero.cta_speak')}
                </Link>
              </MagneticButton>
              <MagneticButton as="div" strength={0.4}>
                <Link to="/contact" className="btn-outline">
                  {t('hero.cta_connect')}
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-float" aria-hidden="true">
          <ChevronDown size={28} className="text-blue-400/60" />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section
        ref={statsRef}
        aria-label="Career statistics"
        className="bg-gray-900 py-10 px-4"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {cmsStats.length > 0
            ? cmsStats.map((s: any) => (
                <StatCounter key={s.id} stat={{ key: s.stat_key, value: parseInt(s.value) || 0, suffix: s.suffix || '+', icon: Award }} visible={statsVisible} label={s.label} />
              ))
            : STATS_FALLBACK.map(stat => (
                <StatCounter key={stat.key} stat={stat} visible={statsVisible} label={t(`hero.${stat.key}`)} />
              ))
          }
        </div>
      </section>

      {/* ===== AI FORMULAS ===== */}
      <section ref={parallaxFormulasRef as React.RefObject<HTMLElement>} aria-labelledby="formulas-heading" className="py-20 px-4 bg-gray-950 relative overflow-hidden">
        {/* Parallax dot-grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px', backgroundPosition: formulasBgPos }} aria-hidden="true" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-2">{t('home.formulas_label')}</p>
            <h2 id="formulas-heading" className="section-title text-white">
              {t('home.formulas_title_1')} <span className="text-blue-400">{t('home.formulas_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-grid">
            {FORMULA_KEYS.map((f, i) => (
              <TiltCard key={i} className="reveal" intensity={6} glare>
                <article
                  className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} ${i === 0 ? 'glow-border' : ''} h-full`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400/70 mb-3">{t(`home.formula_${f.key}_label`)}</p>
                  <h3 className="font-brand text-white font-bold text-lg mb-4 leading-tight">{t(`home.formula_${f.key}_eq`)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(`home.formula_${f.key}_desc`)}
                  </p>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section aria-labelledby="about-heading" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="relative">
              <img
                src="https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/leonard-formal_e4feafa6.png"
                alt="Leonard Chan, MH — Executive Portrait"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-2xl -z-10" />
            </div>
          </div>
          <div className="reveal">
            <p className="section-label mb-2">{t('about.label')}</p>
            <h2 id="about-heading" className="section-title text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t('about.bio_1')}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{t('about.bio_2')}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary">
                {t('about.full_bio')} <ArrowRight size={16} />
              </Link>
              <a href="https://linkedin.com/in/leonardchan" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:border-blue-600 hover:text-blue-600 transition-colors min-h-[44px]">
                {t('about.view_linkedin')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY ACHIEVEMENTS ===== */}
      <section aria-labelledby="achievements-heading" className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-2">{t('home.achievements_label')}</p>
            <h2 id="achievements-heading" className="section-title text-gray-900 dark:text-white">
              {t('home.achievements_title_1')} <span className="text-blue-600">{t('home.achievements_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-grid">
            {ACHIEVEMENT_KEYS.map((a, i) => (
              <TiltCard key={i} className="reveal rounded-3xl" intensity={8} glare>
              <div className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-shadow duration-500 cursor-default" style={{ minHeight: '260px' }}>
                <img src={a.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${a.color} opacity-80 group-hover:opacity-70 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">{a.year}</span>
                <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <a.Icon size={22} className="text-white" aria-hidden="true" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-brand font-bold text-white text-lg mb-1 leading-tight">{t(`home.achievement_${a.key}`)}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{t(`home.achievement_${a.key}_sub`)}</p>
                </div>
              </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPEN TO OPPORTUNITIES ===== */}
      <section ref={parallaxOpportRef as React.RefObject<HTMLElement>} aria-labelledby="opportunities-heading" className="py-20 px-4 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png)', backgroundSize: 'cover', backgroundPosition: opportunitiesBgPos }}>
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-2">{t('opportunities.label')}</p>
            <h2 id="opportunities-heading" className="section-title text-white">
              {t('opportunities.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('opportunities.consulting_title'), desc: t('opportunities.consulting_desc'), Icon: Target },
              { title: t('opportunities.teaching_title'), desc: t('opportunities.teaching_desc'), Icon: GraduationCap },
              { title: t('opportunities.ceo_title'), desc: t('opportunities.ceo_desc'), Icon: Building2 },
            ].map((opp, i) => (
              <div key={i} className="reveal card-lift glass rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true"><opp.Icon size={28} className="text-blue-400" /></div>
                <h3 className="font-bold text-white text-lg mb-3">{opp.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{opp.desc}</p>
                <Link to="/contact" className="btn-primary text-sm">
                  {t('opportunities.cta')} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section aria-labelledby="insights-preview-heading" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 reveal">
            <div>
              <p className="section-label mb-2">{t('insights.label')}</p>
              <h2 id="insights-preview-heading" className="section-title text-gray-900 dark:text-white">
                {t('insights.title')}
              </h2>
            </div>
            <Link to="/insights" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
              {t('insights.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-grid">
            {[
              { titleKey: 'insights_page.article_1_title', catKey: 'insights_page.cat_policy', date: 'Mar 2026', url: '/insights', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80' },
              { titleKey: 'insights_page.article_2_title', catKey: 'insights_page.cat_technology', date: 'Mar 2026', url: '/insights', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80' },
              { titleKey: 'insights_page.article_4_title', catKey: 'insights_page.cat_ai', date: 'Jan 2026', url: '/insights', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80' },
            ].map((article, i) => (
              <TiltCard key={i} className="reveal flex flex-col" intensity={5} glare={false}>
              <article className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full">
                <div className="relative h-40 overflow-hidden">
                  <img src={article.img} alt={t(article.titleKey)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 rounded-full">{t(article.catKey)}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-gray-400 mb-2">{article.date}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-4 flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(article.titleKey)}</h3>
                  <Link to={article.url} className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group/link">
                    {t('insights.read_more')} <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
              </TiltCard>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden reveal">
            <Link to="/insights" className="btn-primary">
              {t('insights.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MEDIA STRIP ===== */}
      <section aria-label="As featured in" className="py-8 px-4 bg-gray-100 dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{t('home.media_strip_label')}</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['大公報', 'Capital 資本', 'Now TV', 'HKICT Awards', 'UN WSA'].map(m => (
              <span key={m} className="text-gray-500 dark:text-gray-500 font-semibold text-sm">{m}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
