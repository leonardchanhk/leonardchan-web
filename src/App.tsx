import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useRef, useCallback, useState } from 'react'
import '../src/i18n'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Organisations = lazy(() => import('./pages/Organisations'))
const Insights = lazy(() => import('./pages/Insights'))
const Speaking = lazy(() => import('./pages/Speaking'))
const Impact = lazy(() => import('./pages/Impact'))
const Projects = lazy(() => import('./pages/Projects'))
const Interests = lazy(() => import('./pages/Interests'))
const Contact = lazy(() => import('./pages/Contact'))
const Media = lazy(() => import('./pages/Media'))
const Wisdom = lazy(() => import('./pages/Wisdom'))
const YearInReview = lazy(() => import('./pages/YearInReview'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

// Scroll to top on every route change (no anchor)
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

/**
 * CursorSpotlight — a subtle radial glow that follows the cursor.
 * Only visible on dark sections; adds depth and premium feel.
 */
function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!spotRef.current) return
      spotRef.current.style.setProperty('--cursor-x', `${e.clientX}px`)
      spotRef.current.style.setProperty('--cursor-y', `${e.clientY}px`)
    })
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if ('ontouchstart' in window) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove])

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
      style={{
        background: 'radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(59,130,246,0.05) 0%, transparent 70%)',
      }}
    />
  )
}

/**
 * StickyFooterLayout — "two sheets of paper" parallax effect.
 *
 * The footer is FIXED at the bottom of the viewport (the bottom sheet).
 * The page content sits ABOVE it with position relative and a higher z-index
 * (the top sheet). A margin-bottom equal to the footer height ensures the
 * document is long enough so that when the user scrolls to the very end,
 * the page content slides up and away — revealing the fixed footer underneath.
 *
 * This creates a true parallax: the footer stays still while the content
 * moves over it, exactly like lifting a piece of paper off a desk.
 */
function StickyFooterLayout({ children }: { children: React.ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerH, setFooterH] = useState(0)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const measure = () => setFooterH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      {/* Fixed footer — pinned to the bottom of the viewport, sits behind everything */}
      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0"
        style={{ zIndex: 1 }}
      >
        <Footer />
      </div>

      {/* Page content — the top sheet of paper that slides up to reveal footer */}
      <div
        className="relative bg-white dark:bg-gray-950 transition-colors duration-300"
        style={{
          zIndex: 10,
          marginBottom: footerH > 0 ? `${footerH}px` : '280px',
          boxShadow: '0 12px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen">
        {/* Cursor spotlight overlay */}
        <CursorSpotlight />
        <Navbar />
        <StickyFooterLayout>
          <main id="main-content" tabIndex={-1}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/organisations" element={<Organisations />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/speaking" element={<Speaking />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/interests" element={<Interests />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/media" element={<Media />} />
                <Route path="/wisdom" element={<Wisdom />} />
                <Route path="/year-in-review" element={<YearInReview />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
        </StickyFooterLayout>
        {/* Floating buttons: accessibility, AI chat, back-to-top */}
        <FloatingButtons />
      </div>
    </BrowserRouter>
  )
}
