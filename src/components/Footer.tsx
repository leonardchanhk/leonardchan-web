import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Linkedin, Facebook, ExternalLink, Instagram } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      role="contentinfo"
      className="bg-gray-950 text-gray-400 py-12 px-4 w-full"
      style={{
        boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle top gradient to reinforce the "paper underneath" feel */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-brand font-bold text-xl text-white mb-2">
              Leonard Chan <span className="text-blue-500">陳迪源</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{t('footer.tagline')}</p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://linkedin.com/in/leonardchan"
                target="_blank" rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://facebook.com/drchan"
                target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/leonardchan"
                target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg hover:bg-white/10 hover:text-pink-400 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tag.digital"
                target="_blank" rel="noopener noreferrer"
                aria-label="tag.digital"
                className="p-2 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">{t('footer.quick_links')}</h3>
            <nav aria-label="Footer navigation">
              {[
                { label: t('nav.about'), path: '/about' },
                { label: t('nav.insights'), path: '/insights' },
                { label: t('nav.speaking'), path: '/speaking' },
                { label: t('nav.impact'), path: '/impact' },
                { label: t('nav.interests'), path: '/interests' },
                { label: t('nav.contact'), path: '/contact' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm py-1 hover:text-blue-400 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Organisations */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">{t('footer.organisations')}</h3>
            <div className="space-y-1 text-sm">
              {[
                { name: 'tag.digital', url: 'https://tag.digital' },
                { name: 'AIRDI', url: 'https://airdi.org' },
                { name: 'HKIRC', url: 'https://hkirc.hk' },
                { name: 'TIA', url: 'https://tia.org.hk' },
                { name: 'HKITDA', url: '#' },
              ].map(org => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank" rel="noopener noreferrer"
                  className="block text-gray-500 hover:text-blue-400 transition-colors duration-150"
                >
                  {org.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">{t('footer.links.privacy')}</Link>
            <Link to="/sitemap" className="hover:text-blue-400 transition-colors">{t('footer.links.sitemap')}</Link>
            <Link to="/media" className="hover:text-blue-400 transition-colors">{t('footer.links.press')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
