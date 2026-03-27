import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, Sparkles, Music2, Brain, BookOpen, Handshake, Leaf, Compass, X, ChevronLeft, ChevronRight } from 'lucide-react'

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

const PHOTO_CATEGORIES_DATA = [
  {
    key: 'urban',
    photos: [
      { src: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=85', altKey: 'hk_skyline' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', altKey: 'hk_harbour' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85', altKey: 'hk_street' },
      { src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=85', altKey: 'hk_tram' },
    ]
  },
  {
    key: 'nature',
    photos: [
      { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=85', altKey: 'mountains' },
      { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85', altKey: 'coast' },
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85', altKey: 'forest' },
      { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=85', altKey: 'lake' },
    ]
  },
  {
    key: 'people',
    photos: [
      { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=85', altKey: 'conversation' },
      { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=85', altKey: 'discussion' },
      { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=85', altKey: 'candid' },
      { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85', altKey: 'conference' },
    ]
  },
]

const GENAI_KEYS = [
  { key: 'ink', img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=85' },
  { key: 'city', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85' },
  { key: 'portrait', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=85' },
  { key: 'data', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85' },
  { key: 'lyric', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=85' },
  { key: 'east_west', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85' },
]

const OTHER_KEYS = [
  { Icon: Brain, key: 'thinking' },
  { Icon: BookOpen, key: 'reading' },
  { Icon: Compass, key: 'global' },
  { Icon: Handshake, key: 'mentorship' },
  { Icon: Leaf, key: 'sustainability' },
]

// Song lyrics are bilingual by nature, kept as data
const SONG = {
  title: 'Endless Possibilities',
  title_zh: '無限可能',
  year: '2024',
  videoUrl: '',
  lyrics_en: `Every morning holds a question
Not yet asked, not yet answered
The map is blank, the compass free
And the only rule is: begin

Endless possibilities
In the space between what is and what could be
Endless possibilities
The future waits for those who dare to see

We carry the weight of what we know
And the lightness of what we don't
The greatest gift is not the answer
But the courage to keep asking why

Endless possibilities
In the space between what is and what could be
Endless possibilities
The future waits for those who dare to see

So let the questions lead you forward
Let the unknown be your guide
In every ending, a beginning
In every closed door, a sky

Endless possibilities
In the space between what is and what could be
Endless possibilities
The future waits for those who dare to see`,
  lyrics_zh: `每個早晨都藏著一個問題
未曾提出，未曾回答
地圖是空白的，指南針自由
唯一的規則是：開始

無限可能
在現實與可能之間的空間
無限可能
未來等待那些敢於看見的人

我們承載著已知的重量
和未知的輕盈
最大的禮物不是答案
而是繼續追問為什麼的勇氣

無限可能
在現實與可能之間的空間
無限可能
未來等待那些敢於看見的人

讓問題引領你前行
讓未知成為你的嚮導
每一個結束中，都有一個開始
每一扇關閉的門後，都是一片天空

無限可能
在現實與可能之間的空間
無限可能
未來等待那些敢於看見的人`,
}

export default function Interests() {
  const { t } = useTranslation()
  useReveal()
  const [lightbox, setLightbox] = useState<{ catIdx: number; photoIdx: number } | null>(null)

  const openLightbox = (catIdx: number, photoIdx: number) => setLightbox({ catIdx, photoIdx })
  const closeLightbox = () => setLightbox(null)
  const prevPhoto = () => {
    if (!lightbox) return
    const cat = PHOTO_CATEGORIES_DATA[lightbox.catIdx]
    setLightbox({ catIdx: lightbox.catIdx, photoIdx: (lightbox.photoIdx - 1 + cat.photos.length) % cat.photos.length })
  }
  const nextPhoto = () => {
    if (!lightbox) return
    const cat = PHOTO_CATEGORIES_DATA[lightbox.catIdx]
    setLightbox({ catIdx: lightbox.catIdx, photoIdx: (lightbox.photoIdx + 1) % cat.photos.length })
  }
  const currentPhoto = lightbox ? PHOTO_CATEGORIES_DATA[lightbox.catIdx].photos[lightbox.photoIdx] : null

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gray-950 overflow-hidden" aria-labelledby="interests-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(99,102,241,0.3) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('interests_page.hero_label')}</p>
          <h1 id="interests-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('interests_page.hero_title_1')} <span className="text-blue-400">{t('interests_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('interests_page.hero_desc')}
          </p>
        </div>
      </section>

      {/* ── PHOTOGRAPHY ── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900" aria-labelledby="photography-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-5 mb-12 reveal">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Camera size={28} className="text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="section-label mb-1">{t('interests_page.photo_label')}</p>
              <h2 id="photography-heading" className="section-title text-gray-900 dark:text-white">{t('interests_page.photo_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl text-base leading-relaxed">
                {t('interests_page.photo_desc')}
              </p>
            </div>
          </div>

          {PHOTO_CATEGORIES_DATA.map((cat, catIdx) => (
            <div key={catIdx} className="mb-14 reveal">
              <div className="mb-5">
                <h3 className="font-brand font-bold text-gray-900 dark:text-white text-xl">{t(`interests_page.photo_cat_${cat.key}`)}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t(`interests_page.photo_cat_${cat.key}_desc`)}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cat.photos.map((photo, photoIdx) => (
                  <button
                    key={photoIdx}
                    onClick={() => openLightbox(catIdx, photoIdx)}
                    className="group relative aspect-square rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={t(`interests_page.photo_alt_${photo.altKey}`)}
                  >
                    <img src={photo.src} alt={t(`interests_page.photo_alt_${photo.altKey}`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox} aria-label="Photo lightbox">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white" onClick={closeLightbox} aria-label="Close lightbox">
            <X size={20} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white" onClick={e => { e.stopPropagation(); prevPhoto() }} aria-label="Previous photo">
            <ChevronLeft size={20} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white" onClick={e => { e.stopPropagation(); nextPhoto() }} aria-label="Next photo">
            <ChevronRight size={20} />
          </button>
          <img src={currentPhoto.src.replace('w=800', 'w=1400')} alt={t(`interests_page.photo_alt_${currentPhoto.altKey}`)} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">{t(`interests_page.photo_alt_${currentPhoto.altKey}`)}</p>
        </div>
      )}

      {/* ── GENAI CREATIVE ── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="genai-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-5 mb-12 reveal">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles size={28} className="text-indigo-600" aria-hidden="true" />
            </div>
            <div>
              <p className="section-label mb-1">{t('interests_page.genai_label')}</p>
              <h2 id="genai-heading" className="section-title text-gray-900 dark:text-white">{t('interests_page.genai_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl text-base leading-relaxed">
                {t('interests_page.genai_desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENAI_KEYS.map((work, i) => (
              <article key={i} className="reveal group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2" style={{ minHeight: '320px' }}>
                <img src={work.img} alt={t(`interests_page.genai_${work.key}`)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent opacity-60" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">{t(`interests_page.genai_${work.key}_tag`)}</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-brand font-bold text-white text-lg mb-2 leading-tight">{t(`interests_page.genai_${work.key}`)}</h3>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">{t(`interests_page.genai_${work.key}_desc`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LYRICS ── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900" aria-labelledby="lyrics-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-5 mb-12 reveal">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Music2 size={28} className="text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="section-label mb-1">{t('interests_page.song_label')}</p>
              <h2 id="lyrics-heading" className="section-title text-gray-900 dark:text-white">{t('interests_page.song_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl text-base leading-relaxed">
                {t('interests_page.song_desc')}
              </p>
            </div>
          </div>

          <div className="reveal bg-gradient-to-br from-blue-950 via-indigo-950 to-gray-950 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative px-8 pt-10 pb-8 border-b border-white/10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">{t('interests_page.song_credit')}</p>
                  <h3 className="font-brand font-bold text-white text-4xl leading-tight">{SONG.title}</h3>
                  <p className="text-blue-300 text-2xl font-brand mt-1">{SONG.title_zh}</p>
                  <p className="text-gray-400 text-sm mt-3">{SONG.year}</p>
                </div>
                {SONG.videoUrl ? (
                  <a href={SONG.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    {t('interests_page.watch_video')}
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-5 py-3 bg-white/10 text-gray-400 rounded-xl font-semibold text-sm border border-white/10 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    {t('interests_page.video_coming')}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-5 max-w-2xl">{t('interests_page.song_intro')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="px-8 py-8">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">English</p>
                <pre className="text-gray-300 text-sm leading-loose whitespace-pre-wrap font-sans">{SONG.lyrics_en}</pre>
              </div>
              <div className="px-8 py-8">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">中文</p>
                <pre className="text-gray-300 text-sm leading-loose whitespace-pre-wrap font-sans">{SONG.lyrics_zh}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OTHER INTERESTS ── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="other-interests-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-2">{t('interests_page.other_label')}</p>
            <h2 id="other-interests-heading" className="section-title text-gray-900 dark:text-white">
              {t('interests_page.other_title_1')} <span className="text-blue-600">{t('interests_page.other_title_2')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {OTHER_KEYS.map((item, i) => (
              <div key={i} className="reveal card-lift bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col gap-4 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <item.Icon size={22} className="text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{t(`interests_page.other_${item.key}`)}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t(`interests_page.other_${item.key}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
