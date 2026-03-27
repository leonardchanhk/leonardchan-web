import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Camera, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

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

const FACT_KEYS = ['name', 'honour', 'roles', 'expertise', 'languages', 'articles', 'media', 'international'] as const

export default function Media() {
  const { t } = useTranslation()
  useReveal()

  const ASSETS = [
    {
      category: t('media_page.asset_photos'),
      Icon: Camera,
      items: [
        { label: t('media_page.asset_formal'), desc: t('media_page.asset_formal_desc'), file: 'https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png', preview: 'https://pub-f980f47725294fa181969ed1e02e6402.r2.dev/site-images/bAkXTDGwdiAfAXQb.png' },
        { label: t('media_page.asset_casual'), desc: t('media_page.asset_casual_desc'), file: null, preview: null },
        { label: t('media_page.asset_speaking'), desc: t('media_page.asset_speaking_desc'), file: null, preview: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80' },
      ],
    },
    {
      category: t('media_page.asset_logos'),
      Icon: Download,
      items: [
        { label: 'tag.digital Logo Pack', desc: 'SVG + PNG in light and dark variants', file: null, preview: null },
        { label: t('media_page.asset_tia_logo'), desc: t('media_page.asset_tia_desc'), file: null, preview: null },
        { label: t('media_page.asset_hkirc_logo'), desc: t('media_page.asset_hkirc_desc'), file: null, preview: null },
      ],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gray-950" aria-labelledby="media-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('media_page.hero_label')}</p>
          <h1 id="media-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('media_page.hero_title_1')} <span className="text-blue-400">{t('media_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-8">
            {t('media_page.hero_desc')}
          </p>
          <a href="mailto:media@leonardchan.com" className="inline-flex items-center gap-2 btn-primary">
            <Mail size={16} /> {t('media_page.cta_email')}
          </a>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="facts-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('media_page.bio_label')}</p>
            <h2 id="facts-heading" className="section-title text-gray-900 dark:text-white">
              {t('media_page.bio_title_1')} <span className="text-blue-600">{t('media_page.bio_title_2')}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
              {t('media_page.bio_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal">
            {FACT_KEYS.map((fk, i) => (
              <div key={i} className="flex gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="w-1 flex-shrink-0 rounded-full bg-blue-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">{t(`media_page.fact_${fk}`)}</p>
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{t(`media_page.fact_${fk}_val`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Assets */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="assets-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 reveal">
            <p className="section-label mb-2">{t('media_page.assets_label')}</p>
            <h2 id="assets-heading" className="section-title text-gray-900 dark:text-white">
              {t('media_page.assets_title_1')} <span className="text-blue-600">{t('media_page.assets_title_2')}</span>
            </h2>
          </div>
          <div className="space-y-10">
            {ASSETS.map((group, gi) => (
              <div key={gi} className="reveal">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                    <group.Icon size={20} className="text-blue-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{group.category}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="card-lift bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col group hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        {item.preview ? (
                          <img src={item.preview} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <group.Icon size={32} className="text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                        {item.file && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">{t('media_page.available')}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col justify-between gap-3 flex-1">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.label}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                        {item.file ? (
                          <a href={item.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            <Download size={14} /> {t('media_page.download')}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 cursor-default">
                            <Mail size={14} /> {t('media_page.request_email')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact CTA */}
      <section className="py-16 px-4 bg-gray-950" aria-label="Media contact">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h2 className="font-brand font-bold text-white text-3xl mb-4">{t('media_page.cta_title')}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {t('media_page.cta_desc')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:media@leonardchan.com" className="btn-primary">
              <Mail size={16} /> {t('media_page.cta_email')}
            </a>
            <Link to="/contact" className="btn-outline">
              {t('media_page.cta_contact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
