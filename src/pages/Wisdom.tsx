import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Quote, Lightbulb, GraduationCap, Compass } from 'lucide-react'

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

const THEME_KEYS = [
  { Icon: Lightbulb, key: 'tech_means' },
  { Icon: GraduationCap, key: 'leadership' },
  { Icon: Compass, key: 'governance' },
  { Icon: Quote, key: 'bridge' },
  { Icon: Lightbulb, key: 'curiosity' },
  { Icon: GraduationCap, key: 'data' },
]

const QUOTE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8']

export default function Wisdom() {
  const { t } = useTranslation()
  useReveal()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gray-950" aria-labelledby="wisdom-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('wisdom_page.hero_label')}</p>
          <h1 id="wisdom-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('wisdom_page.hero_title_1')} <span className="text-blue-400">{t('wisdom_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('wisdom_page.hero_desc')}
          </p>
        </div>
      </section>

      {/* Teaching Themes */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="themes-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('wisdom_page.teaching_label')}</p>
            <h2 id="themes-heading" className="section-title text-gray-900 dark:text-white">
              {t('wisdom_page.teaching_title_1')} <span className="text-blue-600">{t('wisdom_page.teaching_title_2')}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
              {t('wisdom_page.teaching_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THEME_KEYS.map((theme, i) => (
              <article key={i} className="reveal card-lift bg-gray-50 dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                    <theme.Icon size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{t(`wisdom_page.theme_${theme.key}_tag`)}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mt-0.5">{t(`wisdom_page.theme_${theme.key}`)}</h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t(`wisdom_page.theme_${theme.key}_body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="quotes-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('wisdom_page.quotes_label')}</p>
            <h2 id="quotes-heading" className="section-title text-gray-900 dark:text-white">
              {t('wisdom_page.quotes_title_1')} <span className="text-blue-600">{t('wisdom_page.quotes_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUOTE_KEYS.map((qk, i) => (
              <blockquote
                key={i}
                className="reveal bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-200 dark:border-gray-800 border-l-4 border-l-blue-600 flex flex-col gap-4"
              >
                <div className="flex gap-3 items-start">
                  <Quote size={18} className="text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-gray-800 dark:text-gray-200 font-brand font-semibold text-base leading-relaxed">
                    {t(`wisdom_page.quote_${qk}`)}
                  </p>
                </div>
                <footer className="text-blue-600 text-xs font-semibold uppercase tracking-wider pl-7">
                  — {t(`wisdom_page.quote_${qk}_ctx`)}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-950" aria-label="Speaking and teaching enquiries">
        <div className="max-w-3xl mx-auto text-center reveal">
          <GraduationCap size={40} className="text-blue-400 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-brand font-bold text-white text-3xl mb-4">{t('wisdom_page.cta_title')}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {t('wisdom_page.cta_desc')}
          </p>
          <a href="/speaking" className="btn-primary">
            {t('wisdom_page.cta_button')}
          </a>
        </div>
      </section>
    </>
  )
}
