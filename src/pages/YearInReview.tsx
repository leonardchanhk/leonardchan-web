import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Video, ExternalLink, Calendar } from 'lucide-react'

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

function useYearInReview() {
  const { items } = useModule('yearInReview')
  return items
}

export default function YearInReview() {
  const { t } = useTranslation()
  useReveal()
  const videos = useYearInReview()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gray-950" aria-labelledby="yir-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('year_review_page.hero_label', 'Annual Retrospective')}</p>
          <h1 id="yir-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('year_review_page.hero_title_1', 'Year in')} <span className="text-blue-400">{t('year_review_page.hero_title_2', 'Review')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('year_review_page.hero_desc', 'Every year since 2023, Leonard has produced a five-minute visual retrospective — a personal record of milestones, moments, and memories set to music.')}
          </p>
        </div>
      </section>

      {/* Videos */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-label="Year in review videos">
        <div className="max-w-7xl mx-auto space-y-16">
          {videos.map((video, i) => (
            <article key={video.id || i} className="reveal">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Video embed */}
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                  {video.vimeoId ? (
                    <div className="aspect-video">
                      <iframe
                        src={`https://player.vimeo.com/video/${video.vimeoId}?title=0&byline=0&portrait=0&color=3b82f6`}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-gray-900">
                      <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <Video size={32} className="text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm">{video.year} Edition</p>
                        <p className="text-gray-500 text-xs mt-1">{t('year_review_page.video_coming_soon', 'Video coming soon')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                      <Calendar size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{video.year}</p>
                      <h2 className="font-brand font-bold text-gray-900 dark:text-white text-2xl">{video.title}</h2>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{video.description}</p>

                  {/* Highlights */}
                  {video.highlights && video.highlights.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('year_review_page.key_moments', 'Key Moments')}</p>
                      {video.highlights.map((h: string, hi: number) => (
                        <div key={hi} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{h}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {video.vimeoId && (
                    <a
                      href={`https://vimeo.com/${video.vimeoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {t('year_review_page.watch_on_vimeo', 'Watch on Vimeo')} <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {i < videos.length - 1 && (
                <div className="mt-16 border-b border-gray-100 dark:border-gray-800" />
              )}
            </article>
          ))}
          {videos.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Video size={48} className="mx-auto mb-4 opacity-30" />
              <p>{t('year_review_page.loading', 'Loading...')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
