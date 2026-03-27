import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mic, ArrowRight, Bot, Globe, ShieldCheck, Zap, GraduationCap, Landmark, Calendar, MapPin } from 'lucide-react'
import { useParallaxBg } from '../hooks/useParallax'

const CMS_API = 'https://cms-api.leonardchan.com/api'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.08 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const TOPIC_KEYS = [
  { key: 'ai', Icon: Bot, img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80', accent: 'from-blue-900/80 to-blue-950/90' },
  { key: 'gba', Icon: Globe, img: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80', accent: 'from-teal-900/80 to-teal-950/90' },
  { key: 'cyber', Icon: ShieldCheck, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', accent: 'from-slate-900/80 to-slate-950/90' },
  { key: 'digital', Icon: Zap, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', accent: 'from-blue-900/80 to-indigo-950/90' },
  { key: 'steam', Icon: GraduationCap, img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', accent: 'from-purple-900/80 to-purple-950/90' },
  { key: 'internet', Icon: Landmark, img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', accent: 'from-gray-800/80 to-gray-950/90' },
]

function useEngagements(lang: string) {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    fetch(`${CMS_API}/engagements/public/list?lang=${lang}`)
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => {})
  }, [lang])
  return items
}

const TYPE_COLORS: Record<string, string> = {
  Media: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  Industry: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  International: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Regional: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  Academic: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  Government: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
}

const FORMAT_KEYS = ['keynotes', 'panels', 'media', 'workshops', 'lectures'] as const

export default function Speaking() {
  const { t, i18n } = useTranslation()
  useReveal()
  const { ref: heroRef, bgPos: heroBgPos } = useParallaxBg(0.25)
  const { ref: ctaRef, bgPos: ctaBgPos } = useParallaxBg(0.2)
  const engagements = useEngagements(i18n.language)

  return (
    <>
      {/* Hero */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className="relative pt-24 pb-0 bg-gray-950 overflow-hidden" aria-labelledby="speaking-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59,130,246,0.4) 1px, transparent 0)', backgroundSize: '40px 40px', backgroundPosition: heroBgPos }} />
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="section-label mb-3">{t('speaking_page.hero_label')}</p>
          <h1 id="speaking-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('speaking_page.hero_title_1')} <span className="text-blue-400">{t('speaking_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-8">
            {t('speaking_page.hero_desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            {FORMAT_KEYS.map(f => (
              <span key={f} className="px-3 py-1.5 text-xs font-semibold border border-blue-600/30 text-blue-300 rounded-full bg-blue-600/10">{t(`speaking_page.format_${f}`)}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Topics — image cards */}
      <section className="py-20 px-4 bg-gray-950" aria-labelledby="topics-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="section-label mb-2">{t('speaking_page.topics_label')}</p>
            <h2 id="topics-heading" className="section-title text-white">
              {t('speaking_page.topics_title_1')} <span className="text-blue-400">{t('speaking_page.topics_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPIC_KEYS.map((topic, i) => (
              <article key={i} className="reveal group relative rounded-2xl overflow-hidden cursor-default" style={{ aspectRatio: '4/3' }}>
                <img src={topic.img} alt={t(`speaking_page.topic_${topic.key}_title`)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading={i < 3 ? 'eager' : 'lazy'} />
                <div className={`absolute inset-0 bg-gradient-to-t ${topic.accent} transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors duration-300">
                    <topic.Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">{t(`speaking_page.topic_${topic.key}_tag`)}</span>
                  <h3 className="font-brand font-bold text-white text-xl mb-2 leading-snug group-hover:text-blue-100 transition-colors">
                    {t(`speaking_page.topic_${topic.key}_title`)}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-24 overflow-hidden">
                    {t(`speaking_page.topic_${topic.key}_desc`)}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Past Engagements */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="engagements-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('speaking_page.engagements_label')}</p>
            <h2 id="engagements-heading" className="section-title text-gray-900 dark:text-white">
              {t('speaking_page.engagements_title_1')} <span className="text-blue-600">{t('speaking_page.engagements_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {engagements.map((e, i) => (
              <div key={e.id || i} className="reveal group flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl px-5 py-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 cursor-default">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mic size={15} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm block truncate group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{e.event_name || e.event_name_en}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin size={10} /> {e.location || e.location_en}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${TYPE_COLORS[e.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{e.type}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={10} /> {e.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef as React.RefObject<HTMLElement>} className="py-20 px-4 bg-gray-950" aria-label="Speaking booking">
        <div className="max-w-4xl mx-auto reveal">
          <div className="relative rounded-3xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" alt="" aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-20" style={{ objectPosition: ctaBgPos }} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-gray-950" />
            <div className="relative p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                <Mic size={28} className="text-blue-400" />
              </div>
              <h2 className="font-brand font-bold text-white text-3xl sm:text-4xl mb-4">{t('speaking_page.cta_title')}</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('speaking_page.cta_desc')}
              </p>
              <Link to="/contact" className="btn-primary group">
                {t('speaking_page.cta_button')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
