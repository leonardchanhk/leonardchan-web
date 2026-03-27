import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Building2, GraduationCap, Landmark, Users, Briefcase, Globe } from 'lucide-react'

import { useModule } from '../hooks/useCmsData'

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

type OrgCategory = 'All' | 'Commercial' | 'Government' | 'Statutory' | 'Industry' | 'Academic' | 'Community' | 'Technology'

const CAT_KEYS: { value: OrgCategory; i18nKey: string }[] = [
  { value: 'All', i18nKey: 'cat_all' },
  { value: 'Commercial', i18nKey: 'cat_commercial' },
  { value: 'Government', i18nKey: 'cat_government' },
  { value: 'Statutory', i18nKey: 'cat_statutory' },
  { value: 'Industry', i18nKey: 'cat_industry' },
  { value: 'Academic', i18nKey: 'cat_academic' },
  { value: 'Community', i18nKey: 'cat_community' },
]

// Safe category label — falls back to the raw value if no i18n key found
function getCatLabel(t: (k: string) => string, category: string): string {
  const key = `organisations_page.cat_${category.toLowerCase()}`
  const translated = t(key)
  // i18next returns the key itself when not found
  return translated === key ? category : translated
}

// Map category to icon
const CAT_ICONS: Record<string, any> = {
  Commercial: Briefcase,
  Government: Landmark,
  Statutory: Building2,
  Industry: Globe,
  Academic: GraduationCap,
  Community: Users,
}

// Map category to gradient accent
const CAT_ACCENTS: Record<string, string> = {
  Commercial: 'from-blue-600 to-blue-400',
  Government: 'from-slate-700 to-blue-600',
  Statutory: 'from-blue-700 to-cyan-500',
  Industry: 'from-indigo-600 to-blue-400',
  Academic: 'from-indigo-700 to-blue-400',
  Community: 'from-blue-600 to-sky-400',
}

function useOrganisations() {
  const { items } = useModule('organisations')
  return items
}

export default function Organisations() {
  const { t } = useTranslation()
  useReveal()
  const [filter, setFilter] = useState<OrgCategory>('All')
  const orgs = useOrganisations()

  const filtered = filter === 'All' ? orgs : orgs.filter(o => o.category === filter)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gray-950 overflow-hidden" aria-labelledby="orgs-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3" style={{ color: '#60a5fa' }}>{t('organisations_page.hero_label')}</p>
          <h1 id="orgs-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('organisations_page.hero_title_1')} <span style={{ color: '#60a5fa' }}>{t('organisations_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('organisations_page.hero_desc')}
          </p>
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: '15+', label: t('organisations_page.stat_roles') },
              { value: '4', label: t('organisations_page.stat_gov') },
              { value: '3', label: t('organisations_page.stat_academic') },
              { value: '30+', label: t('organisations_page.stat_years') },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-brand font-bold text-3xl" style={{ color: '#60a5fa' }}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30" aria-label="Filter organisations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="group" aria-label="Filter by category" className="flex gap-1 overflow-x-auto py-3">
            {CAT_KEYS.map(cat => (
              <button key={cat.value} onClick={() => setFilter(cat.value)} aria-pressed={filter === cat.value}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all min-h-[40px] focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  filter === cat.value ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}>
                {t(`organisations_page.${cat.i18nKey}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Org Cards */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-label="Organisation cards">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((org) => {
              const Icon = CAT_ICONS[org.category] || Globe
              const accent = CAT_ACCENTS[org.category] || 'from-blue-600 to-blue-400'
              return (
                <article key={org.id} className="reveal group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col border border-gray-100 dark:border-gray-800">
                  <div className={`relative h-44 bg-gradient-to-br ${accent} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    </div>
                    {org.logoUrl ? (
                      <div className="relative z-10 w-40 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-400">
                        <img src={org.logoUrl} alt={org.name} className="max-h-16 max-w-full object-contain" loading="lazy" />
                      </div>
                    ) : (
                      <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon size={36} className="text-white" aria-hidden="true" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-black/25 backdrop-blur-sm text-white border border-white/25 tracking-wide">
                      {getCatLabel(t, org.category || '')}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-brand font-bold text-gray-900 dark:text-white text-lg mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{org.name}</h2>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>{org.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 flex-1">{org.description}</p>
                    {org.websiteUrl && org.websiteUrl !== '#' && (
                      <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t('organisations_page.visit_website')}: ${org.name}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link">
                        {t('organisations_page.visit_website')} <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-16">{t('organisations_page.no_orgs')}</p>}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 text-center" aria-label="Call to action">
        <div className="max-w-2xl mx-auto reveal">
          <h2 className="font-brand font-bold text-gray-900 dark:text-white text-3xl mb-4">{t('organisations_page.cta_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('organisations_page.cta_desc')}</p>
          <a href="/contact" className="btn-primary">{t('organisations_page.cta_button')}</a>
        </div>
      </section>
    </>
  )
}
