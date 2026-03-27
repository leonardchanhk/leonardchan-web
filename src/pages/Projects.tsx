import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, ImageOff } from 'lucide-react'

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

const PROJECTS = [
  { titleKey: 'tag.digital', subtitleKey: 'Digital Transformation Consultancy', year: '2020–Present', status: 'Active', descKey: 'Founded and leads tag.digital — a boutique consultancy helping enterprises navigate digital transformation, AI adoption, and cybersecurity strategy across Hong Kong and the GBA.', url: 'https://tag.digital', tags: ['AI Strategy', 'Digital Transformation', 'Consulting'], color: 'border-blue-600/40' },
  { titleKey: 'AIRDI AI Governance Framework', subtitleKey: 'Policy & Research Initiative', year: '2026–Present', status: 'Active', descKey: "Contributing to the development of Hong Kong's national AI governance framework as a Board Member of the Artificial Intelligence Research and Development Institute.", url: 'https://www.airdi.hk', tags: ['AI Governance', 'Policy', 'Research'], color: 'border-blue-500/40' },
  { titleKey: 'HKITDA Industry Advocacy', subtitleKey: 'Industry Leadership', year: '2021–2023', status: 'Completed', descKey: "As President of HKITDA, led major industry advocacy campaigns for Hong Kong's ICT sector, including talent development, regulatory reform, and GBA digital integration.", url: 'https://www.hkitda.org', tags: ['Industry', 'Advocacy', 'Leadership'], color: 'border-teal-500/40' },
  { titleKey: 'TIA Digital Economy Initiative', subtitleKey: 'Industry Coalition', year: '2023–Present', status: 'Active', descKey: 'Chairs the Technology Industry Alliance, driving collective industry action on digital economy policy, talent pipeline, and international connectivity.', url: 'https://www.tia.org.hk', tags: ['Digital Economy', 'Industry', 'Policy'], color: 'border-purple-500/40' },
  { titleKey: 'UN World Summit Award', subtitleKey: 'm-Media & News Category', year: '2016', status: 'Awarded', descKey: 'Won the prestigious UN World Summit Award in the m-Media & News category — recognising innovative digital media solutions with global social impact.', url: 'https://www.wsis.org', tags: ['UN Award', 'Digital Media', 'Innovation'], color: 'border-green-500/40' },
  { titleKey: 'Embroidery CAD/CAM Patent', subtitleKey: 'Technology Innovation', year: '2001', status: 'Patented', descKey: 'Holds a patent for an embroidery CAD/CAM system that converts XY coordinates of embroidery designs into scalable digital data — an early example of industrial digitisation.', url: 'https://patents.google.com', tags: ['Patent', 'CAD/CAM', 'Innovation'], color: 'border-rose-500/40' },
  { titleKey: 'Project Prove', subtitleKey: 'Digital Identity Pioneer', year: '2015', status: 'Completed', descKey: "Pioneered digital identity verification solutions for Hong Kong's financial and public services sectors — a precursor to today's digital ID infrastructure.", url: '#', tags: ['Digital Identity', 'FinTech', 'GovTech'], color: 'border-blue-500/40' },
  { titleKey: 'HKICT Award Judging System', subtitleKey: 'Platform Innovation', year: '2013', status: 'Live', descKey: 'Designed and built the cloud-based real-time scoring and judging system for the Hong Kong ICT Awards — now used by approximately 100 awards locally and internationally.', url: 'https://www.hkictawards.hk', tags: ['Platform', 'Cloud', 'Awards'], color: 'border-teal-500/40' },
]

type Project = typeof PROJECTS[number] & { photo?: string }

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const { t } = useTranslation()
  return (
    <article className={`reveal card-lift bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 border-l-4 ${p.color} flex flex-col`}>
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {p.photo ? (
          <img src={p.photo} alt={`${p.titleKey} — project photo`} className="w-full h-full object-cover" loading={i < 4 ? 'eager' : 'lazy'} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
              <ImageOff size={28} className="text-blue-400/50" />
            </div>
            <p className="text-xs text-gray-400 font-medium">{t('projects_page.photo_coming')}</p>
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
        {p.url !== '#' && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.titleKey}`}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-900/90 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
            <ExternalLink size={13} />
          </a>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-mono mb-1">{p.year}</p>
        <h2 className="font-brand font-bold text-gray-900 dark:text-white text-lg mb-0.5 leading-snug">{p.titleKey}</h2>
        <p className="text-sm text-blue-600 font-semibold mb-3">{p.subtitleKey}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">{p.descKey}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  useReveal()

  return (
    <>
      <section className="relative pt-24 pb-16 bg-gray-950" aria-labelledby="projects-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('projects_page.hero_label')}</p>
          <h1 id="projects-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('projects_page.hero_title_1')} <span className="text-blue-400">{t('projects_page.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('projects_page.hero_desc')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-label="Projects list">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={i} p={p} i={i} />
          ))}
        </div>
      </section>
    </>
  )
}
