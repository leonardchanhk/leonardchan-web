import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Search, Tv, Quote, Lightbulb, GraduationCap, Compass, Globe, Loader2 } from 'lucide-react'

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

const MEDIA_LOGOS: Record<string, { color: string }> = {
  '大公報': { color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' },
  'Capital 資本': { color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' },
}

// Fallback images by category for articles without a cover_image
const CAT_IMAGES: Record<string, string> = {
  'Policy': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Technology': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  'AI Governance': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  'GBA': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&q=80',
  'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
  'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
  'default': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
}

function useTvAppearances() {
  const { items } = useModule('tvAppearances')
  return items
}

const THEME_ICONS = [Lightbulb, GraduationCap, Compass, Quote, Lightbulb, GraduationCap]

const CAT_KEYS = ['all', 'policy', 'technology', 'ai', 'gba', 'cyber', 'education'] as const
const CAT_VALUES = ['All', 'Policy', 'Technology', 'AI Governance', 'GBA', 'Cybersecurity', 'Education']
const TAB_KEYS = ['writing', 'interviews', 'wisdom'] as const

interface Post {
  id: number
  slug: string
  type: string
  status: string
  coverImage: string | null
  category: string | null
  tags: string | null
  author: string | null
  publishedAt: string | null
  sortOrder: number
  titleEn: string
  titleTc: string
  titleSc: string
  excerptEn: string
  excerptTc: string
  excerptSc: string
}

function getPostTitle(post: Post, lang: string): string {
  if (lang === 'tc') return post.titleTc || post.titleEn
  if (lang === 'sc') return post.titleSc || post.titleTc || post.titleEn
  return post.titleEn
}

function getPostExcerpt(post: Post, lang: string): string {
  if (lang === 'tc') return post.excerptTc || post.excerptEn
  if (lang === 'sc') return post.excerptSc || post.excerptTc || post.excerptEn
  return post.excerptEn
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch { return '' }
}

function parseTags(tags: string | null): Record<string, string> {
  if (!tags) return {}
  try { return JSON.parse(tags) } catch { return {} }
}

export default function Insights() {
  const { t, i18n } = useTranslation()
  const [tab, setTab] = useState<typeof TAB_KEYS[number]>('writing')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  useReveal()

  const currentLang = i18n.language // 'en', 'tc', or 'sc'
  const tvAppearances = useTvAppearances()

  // Load posts from CMS data
  const { items: cmsPosts } = useModule('posts')
  useEffect(() => {
    setPosts(cmsPosts as any[])
    setPostsLoading(false)
  }, [cmsPosts])

  const articles = posts.map((p, idx) => {
    const tagData = parseTags(p.tags)
    return {
      ...p,
      title: getPostTitle(p, currentLang),
      titleZh: p.titleTc || p.titleEn,
      summary: getPostExcerpt(p, currentLang),
      cat: p.category || 'Technology',
      date: formatDate(p.publishedAt),
      img: p.coverImage || CAT_IMAGES[p.category || ''] || CAT_IMAGES['default'],
      originalLang: 'zh',
      pub: tagData.pub || '',
      url: tagData.url || '#',
      featured: idx === 0,
    }
  })

  const filtered = articles.filter(a =>
    (filter === 'All' || a.cat === filter) &&
    (search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.titleZh.includes(search))
  )

  const isOriginalLang = () => currentLang === 'tc' || currentLang === 'sc'

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-0 bg-gray-950 overflow-hidden" aria-labelledby="insights-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('insights_page.hero_label')}</p>
          <h1 id="insights-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('insights_page.hero_title_1')} <span className="text-blue-400">{t('insights_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-6">
            {t('insights_page.hero_desc')}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{t('insights_page.published_in')}</span>
            {['大公報', 'Capital 資本'].map(pub => (
              <span key={pub} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${MEDIA_LOGOS[pub]?.color}`}>{pub}</span>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-gray-800" role="tablist" aria-label="Content sections">
            {TAB_KEYS.map(tk => (
              <button
                key={tk}
                role="tab"
                aria-selected={tab === tk}
                onClick={() => setTab(tk)}
                className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 ${
                  tab === tk
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                {t(`insights_page.tab_${tk}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WRITING TAB ── */}
      {tab === 'writing' && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-label="Articles">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 reveal">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('insights_page.search_placeholder')} aria-label={t('insights_page.search_placeholder')}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200" />
              </div>
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
                {CAT_KEYS.map((ck, ci) => (
                  <button key={ck} onClick={() => setFilter(CAT_VALUES[ci])} aria-pressed={filter === CAT_VALUES[ci]}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors min-h-[36px] focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      filter === CAT_VALUES[ci] ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600'
                    }`}>{t(`insights_page.cat_${ck}`)}</button>
                ))}
              </div>
            </div>

            {/* Loading state */}
            {postsLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
              </div>
            )}

            {!postsLoading && (
              <>
                {/* Featured article */}
                {filter === 'All' && search === '' && filtered.length > 0 && (
                  <div className="mb-10 reveal">
                    {filtered.filter(a => a.featured).map((a) => (
                      <article key={a.id} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col md:flex-row">
                        <div className="md:w-2/5 h-56 md:h-auto overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">{t('insights_page.featured')}</span>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{a.cat}</span>
                            {a.date && <span className="text-gray-400 text-xs">· {a.date}</span>}
                            {a.pub && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${MEDIA_LOGOS[a.pub]?.color || 'border-gray-200 text-gray-600'}`}>{a.pub}</span>}
                          </div>
                          <h2 className="font-brand font-bold text-gray-900 dark:text-white text-2xl mb-2 leading-snug">{a.title}</h2>
                          {!isOriginalLang() && (
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-gray-400 text-sm">{a.titleZh}</p>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full">
                                <Globe size={10} /> {t('insights_page.translated')}
                              </span>
                            </div>
                          )}
                          {isOriginalLang() && currentLang !== 'en' && (
                            <p className="text-gray-400 text-sm mb-2">{a.titleZh}</p>
                          )}
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{a.summary}</p>
                          <div className="flex items-center gap-3">
                            <a href={a.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('insights_page.read_full')}: ${a.title}`}
                              className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                              {t('insights_page.read_full')} <ExternalLink size={14} />
                            </a>
                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                              <Globe size={10} /> {t('insights_page.original_lang')}: 中文
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Article grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.filter(a => !a.featured || filter !== 'All' || search !== '').map((a) => (
                    <article key={a.id} className="reveal group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                      <div className="h-44 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative">
                        <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        {!isOriginalLang() && (
                          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100/90 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full backdrop-blur-sm">
                            <Globe size={9} /> {t('insights_page.translated')}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{a.cat}</span>
                          {a.pub && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">·</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${MEDIA_LOGOS[a.pub]?.color || 'border-gray-200 text-gray-600'}`}>{a.pub}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{a.title}</h3>
                        <p className="text-xs text-gray-400 mb-2">{a.titleZh}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-3 line-clamp-2">{a.summary}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            {a.date && <span className="text-xs text-gray-400">{a.date}</span>}
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Globe size={9} /> 中文</span>
                          </div>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('insights_page.read')}: ${a.title}`}
                            className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
                            {t('insights_page.read')} <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {filtered.length === 0 && !postsLoading && (
                  <p className="text-center text-gray-400 py-16">{t('insights_page.no_results')}</p>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ── INTERVIEWS TAB ── */}
      {tab === 'interviews' && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="tv-heading">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 reveal">
              <div className="inline-flex items-center gap-2 mb-3">
                <Tv size={20} className="text-blue-600" aria-hidden="true" />
                <p className="section-label">{t('insights_page.media_appearances')}</p>
              </div>
              <h2 id="tv-heading" className="section-title text-gray-900 dark:text-white">
                {t('insights_page.tv_title_1')} <span className="text-blue-600">{t('insights_page.tv_title_2')}</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
                {t('insights_page.tv_desc')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tvAppearances.map((tv: any, idx: number) => (
                <article key={tv.id || idx} className="reveal group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {tv.thumbnailUrl ? (
                      <img src={tv.thumbnailUrl} alt={tv.topic || tv.program} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Tv size={40} className="text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg" aria-hidden="true">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        <Tv size={11} aria-hidden="true" /> {tv.channel}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-blue-600 font-semibold mb-1">{tv.program} · {tv.airDate}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{tv.topic}</h3>
                    {tv.url && (
                      <a href={tv.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('insights_page.watch_interview')}: ${tv.topic}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        {t('insights_page.watch_interview')} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
              {tvAppearances.length === 0 && (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <Tv size={40} className="mx-auto mb-4 opacity-30" />
                  <p>{t('insights_page.no_tv', 'No TV appearances yet.')}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── WISDOM & TEACHING TAB ── */}
      {tab === 'wisdom' && (
        <>
          {/* Teaching Themes */}
          <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="themes-heading">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 reveal">
                <p className="section-label mb-2">{t('insights_page.teaching_label')}</p>
                <h2 id="themes-heading" className="section-title text-gray-900 dark:text-white">
                  {t('insights_page.teaching_title_1')} <span className="text-blue-600">{t('insights_page.teaching_title_2')}</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
                  {t('insights_page.teaching_desc')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const Icon = THEME_ICONS[i - 1]
                  return (
                    <article key={i} className="reveal card-lift bg-gray-50 dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{t(`insights_page.theme_${i}_tag`)}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mt-0.5">{t(`insights_page.theme_${i}_title`)}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t(`insights_page.theme_${i}_body`)}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Quotes */}
          <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="quotes-heading">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 reveal">
                <p className="section-label mb-2">{t('insights_page.quotes_label')}</p>
                <h2 id="quotes-heading" className="section-title text-gray-900 dark:text-white">
                  {t('insights_page.quotes_title_1')} <span className="text-blue-600">{t('insights_page.quotes_title_2')}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <blockquote
                    key={i}
                    className="reveal bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-200 dark:border-gray-800 border-l-4 border-l-blue-600 flex flex-col gap-4"
                  >
                    <div className="flex gap-3 items-start">
                      <Quote size={18} className="text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-gray-800 dark:text-gray-200 font-brand font-semibold text-base leading-relaxed">
                        {t(`insights_page.quote_${i}`)}
                      </p>
                    </div>
                    <footer className="text-blue-600 text-xs font-semibold uppercase tracking-wider pl-7">
                      — {t(`insights_page.quote_${i}_ctx`)}
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
              <h2 className="font-brand font-bold text-white text-3xl mb-4">{t('insights_page.cta_title')}</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {t('insights_page.cta_desc')}
              </p>
              <a href="/speaking" className="btn-primary">
                {t('insights_page.cta_button')}
              </a>
            </div>
          </section>
        </>
      )}
    </>
  )
}
