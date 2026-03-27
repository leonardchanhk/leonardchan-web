import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react'

// Main nav items
const NAV_ITEMS = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'organisations', path: '/organisations' },
  { key: 'insights', path: '/insights' },
  { key: 'speaking', path: '/speaking' },
  { key: 'impact', path: '/impact' },
  { key: 'interests', path: '/interests' },
]

// Connect dropdown
const CONNECT_ITEMS = [
  { label: 'Contact', path: '/contact' },
  { label: 'Media Corner', path: '/media' },
  { label: 'Year in Review', path: '/year-in-review' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const connectRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('lc_theme')
      if (saved === 'dark') return true
      if (saved === 'light') return false
      return false
    } catch { return false }
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('lc_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (connectRef.current && !connectRef.current.contains(e.target as Node)) {
        setConnectOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled
  const isConnectActive = CONNECT_ITEMS.some(i => location.pathname === i.path)

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50'
      }`}
    >
      <a href="#main-content" className="sr-only">{t('a11y.skip')}</a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-brand font-bold text-lg" aria-label="Leonard Chan — Home">
            <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              isTransparent ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-600 text-white'
            }`}>LC</span>
            <span className={`hidden sm:block ${isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Leonard Chan
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.key}
                to={item.path}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                className={`nav-link text-sm font-medium transition-colors px-2 py-1 rounded ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}

            {/* Connect dropdown */}
            <div ref={connectRef} className="relative">
              <button
                onClick={() => setConnectOpen(o => !o)}
                aria-expanded={connectOpen}
                aria-haspopup="true"
                className={`nav-link text-sm font-medium transition-colors flex items-center gap-1 px-2 py-1 rounded ${
                  isConnectActive
                    ? 'text-blue-600'
                    : isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {t('nav.connect')}
                <ChevronDown size={14} className={`transition-transform ${connectOpen ? 'rotate-180' : ''}`} />
              </button>

              {connectOpen && (
                <div role="menu" className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {CONNECT_ITEMS.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      role="menuitem"
                      onClick={() => setConnectOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Language selection" className="flex items-center gap-0.5">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  aria-pressed={i18n.language === lang.code}
                  aria-label={lang.full}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-colors min-h-[32px] ${
                    i18n.language === lang.code
                      ? 'bg-blue-600 text-white'
                      : isTransparent
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDark(d => !d)}
              aria-label={dark ? t('a11y.toggle_light') : t('a11y.toggle_dark')}
              aria-pressed={dark}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isTransparent
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('a11y.close_menu') : t('a11y.open_menu')}
              className={`lg:hidden p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isTransparent
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600'
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav id="mobile-menu" role="menu" aria-label="Mobile navigation"
          className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-4">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.key}
              to={item.path}
              role="menuitem"
              aria-current={location.pathname === item.path ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 px-2 text-sm font-medium border-b border-gray-100 dark:border-gray-800 transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="pt-2">
            <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">Connect</p>
            {CONNECT_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={`block py-3 px-4 text-sm font-medium border-b border-gray-100 dark:border-gray-800 transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
