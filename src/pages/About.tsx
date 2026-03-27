import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Linkedin, Award, BookOpen, Users, Briefcase, ExternalLink } from 'lucide-react'
import { useParallaxBg } from '../hooks/useParallax'

import { useModule } from '../hooks/useCmsData'

interface TimelineEntry {
  id: number
  year: number
  sort_order: number
  text_en: string
  text_tc: string
  text_sc: string
}

interface AffiliationEntry {
  id: number
  name: string
  role_en: string
  role_tc: string
  role_sc: string
  logo_url: string | null
  website_url: string | null
  sort_order: number
}

interface AwardEntry {
  id: number
  title_en: string
  title_tc: string
  title_sc: string
  organisation_en: string
  organisation_tc: string
  organisation_sc: string
  year: number | null
  logo_url: string | null
  sort_order: number
}

function useReveal(deps: any[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.05, rootMargin: '0px 200px 0px 200px' })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function About() {
  const { t, i18n } = useTranslation()
  const { items: timelinePosts } = useModule('timelineEntries')
  const { items: affiliations } = useModule('affiliations')
  const { items: awards } = useModule('awards')
  useReveal([timelinePosts, affiliations, awards])
  const { ref: heroParallaxRef, bgPos: heroBgPos } = useParallaxBg(0.3)
  const { ref: ctaParallaxRef, bgPos: ctaBgPos } = useParallaxBg(0.2)

  const currentLang = i18n.language

  // CMS data loaded via useCmsData hooks above

  function getTimelineText(entry: TimelineEntry): string {
    if (currentLang === 'tc') return entry.text_tc || entry.text_en
    if (currentLang === 'sc') return entry.text_sc || entry.text_tc || entry.text_en
    return entry.text_en
  }

  function getAffRole(aff: AffiliationEntry): string {
    if (currentLang === 'tc') return aff.role_tc || aff.role_en
    if (currentLang === 'sc') return aff.role_sc || aff.role_tc || aff.role_en
    return aff.role_en
  }

  function getAwardTitle(aw: AwardEntry): string {
    if (currentLang === 'tc') return aw.title_tc || aw.title_en
    if (currentLang === 'sc') return aw.title_sc || aw.title_tc || aw.title_en
    return aw.title_en
  }

  function getAwardOrg(aw: AwardEntry): string {
    if (currentLang === 'tc') return aw.organisation_tc || aw.organisation_en
    if (currentLang === 'sc') return aw.organisation_sc || aw.organisation_tc || aw.organisation_en
    return aw.organisation_en
  }

  // Abbreviation fallback for logos
  function abbr(name: string): string {
    return name.split(/[\s\-\/]/).map(w => w[0]).join('').toUpperCase().slice(0, 4)
  }

  return (
    <>
      {/* Page Hero */}
      <section ref={heroParallaxRef as React.RefObject<HTMLElement>} className="relative pt-24 pb-16 bg-gray-950 overflow-hidden" aria-labelledby="about-page-heading">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png)', backgroundSize: 'cover', backgroundPosition: heroBgPos }}>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('about.label')}</p>
          <h1 id="about-page-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            陳迪源 <span className="text-blue-400">Leonard Chan</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">{t('about.hero_subtitle')}</p>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-label="Biography">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 reveal">
            <img src="https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png" alt="Leonard Chan MH — Formal Portrait"
              className="w-full rounded-2xl shadow-2xl" />
            <div className="mt-6 flex flex-col gap-3">
              <a href="https://leonardchan.com/media" aria-label="Media Corner — biography and press resources"
                className="btn-primary justify-center">
                <ExternalLink size={16} /> {t('about.full_bio')}
              </a>
              <a href="https://linkedin.com/in/leonardchan" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:border-blue-600 hover:text-blue-600 transition-colors min-h-[44px]">
                <Linkedin size={16} /> {t('about.view_linkedin')}
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 reveal">
            <h2 className="section-title text-gray-900 dark:text-white mb-6">{t('about.title')}</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>{t('about.bio_1')}</p>
              <p>{t('about.bio_2')}</p>
              <p>{t('about.bio_3')}</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Award, value: '30+', label: t('about.stat_years_tech') },
                { icon: BookOpen, value: '100+', label: t('about.stat_articles') },
                { icon: Users, value: '15+', label: t('about.stat_roles') },
                { icon: Briefcase, value: '15+', label: t('about.stat_public_service') },
              ].map(s => (
                <div key={s.label} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <s.icon size={20} className="text-blue-600 mx-auto mb-1" />
                  <div className="font-brand font-bold text-2xl text-blue-700 dark:text-blue-400">{s.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline — Horizontal */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 overflow-hidden" aria-labelledby="timeline-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-2">{t('about.career_label')}</p>
            <h2 id="timeline-heading" className="section-title text-gray-900 dark:text-white">
              {t('about.career_title_1')} <span className="text-blue-600">{t('about.career_title_2')}</span>
            </h2>
          </div>
        </div>
        <div className="relative">
          {/* Connector line — behind cards (z-0) */}
          <div className="absolute top-[108px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600/40 to-transparent z-0" aria-hidden="true" />
          <div
            role="list"
            aria-label="Career timeline"
            className="flex gap-0 overflow-x-auto pb-8 px-8 sm:px-16 snap-x snap-mandatory relative z-10"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(59,130,246,0.3) transparent' }}
          >
            {timelinePosts.length === 0 && (
              <div className="flex items-center justify-center w-full py-16 text-gray-400 text-sm">Loading timeline…</div>
            )}
            {timelinePosts.map((item, i) => (
              <article key={item.id || i} role="listitem" className="flex-shrink-0 w-64 snap-start px-3 opacity-100 relative z-10">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-brand font-bold text-xs shadow-lg shadow-blue-500/30 relative z-20">
                    {item.year}
                  </div>
                  <div className="w-0.5 h-5 bg-blue-600/40" aria-hidden="true" />
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-full h-20 rounded-xl mb-3 bg-gradient-to-br from-blue-600/10 to-blue-700/5 border border-blue-600/20 flex items-center justify-center">
                    <span className="font-brand font-bold text-blue-600/50 text-xl">{item.year}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{getTimelineText(item)}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-1" aria-label="Scroll horizontally to see more">← {t('about.scroll_hint')} →</p>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="awards-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 reveal">
            <p className="section-label mb-2">{t('about.recognition_label')}</p>
            <h2 id="awards-heading" className="section-title text-gray-900 dark:text-white">
              {t('about.awards_title_1')} <span className="text-blue-600">{t('about.awards_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {awards.map((a) => (
              <div key={a.id} className="reveal card-lift bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 flex items-center justify-center px-6 border-b border-gray-100 dark:border-gray-700">
                  {a.logo_url
                    ? <img src={a.logo_url} alt={getAwardOrg(a)} className="max-h-20 max-w-full object-contain" loading="lazy" />
                    : <span className="font-brand font-bold text-blue-600 dark:text-blue-400 text-lg tracking-wide">{abbr(getAwardOrg(a) || getAwardTitle(a))}</span>
                  }
                </div>
                <div className="p-5 flex-1">
                  {a.year && <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-2">{a.year}</span>}
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-1 mb-1 leading-snug">{getAwardTitle(a)}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getAwardOrg(a)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Professional Affiliations with logos */}
          <div className="mt-16 reveal">
            <div className="text-center mb-8">
              <p className="section-label mb-2">{t('about.memberships_label_2')}</p>
              <h2 className="section-title text-gray-900 dark:text-white">{t('about.affiliations_title_1')} <span className="text-blue-600">{t('about.affiliations_title_2')}</span></h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {affiliations.map((a) => (
                <div key={a.id} className="reveal card-lift bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="h-20 w-full flex items-center justify-center">
                    {a.logo_url
                      ? <img src={a.logo_url} alt={a.name} className="max-h-16 max-w-full object-contain" loading="lazy" />
                      : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <span className="text-white font-brand font-bold text-sm">{abbr(a.name)}</span>
                        </div>
                      )
                    }
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{a.name}</p>
                    <p className="text-xs text-blue-600 mt-0.5">{getAffRole(a)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaParallaxRef as React.RefObject<HTMLElement>} className="py-16 px-4 bg-gray-950 text-center relative overflow-hidden" aria-label="Call to action">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px', backgroundPosition: ctaBgPos }} aria-hidden="true" />
        <div className="max-w-2xl mx-auto reveal relative">
          <h2 className="font-brand font-bold text-white text-3xl mb-4">{t('about.cta_about_title')}</h2>
          <p className="text-gray-400 mb-8">{t('about.cta_about_desc')}</p>
          <Link to="/contact" className="btn-primary">{t('about.cta_about_button')}</Link>
        </div>
      </section>
    </>
  )
}
