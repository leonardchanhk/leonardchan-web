import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send, Bot, ChevronUp, Eye, Type, Contrast, Underline, RotateCcw, AlignJustify, Minus, Plus, BookOpen, MousePointer2 } from 'lucide-react'

// ─── Accessibility State ───────────────────────────────────────────────────────
interface A11yState {
  fontSize: number
  letterSpacing: number
  lineHeight: number
  highContrast: boolean
  underlineLinks: boolean
  dyslexiaFont: boolean
  readingGuide: boolean
  cursorLarge: boolean
}

const A11Y_DEFAULTS: A11yState = {
  fontSize: 100, letterSpacing: 0, lineHeight: 0,
  highContrast: false, underlineLinks: false,
  dyslexiaFont: false, readingGuide: false, cursorLarge: false,
}

function loadA11y(): A11yState {
  try {
    const saved = localStorage.getItem('lc_a11y')
    if (saved) return { ...A11Y_DEFAULTS, ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return { ...A11Y_DEFAULTS }
}

// ─── Accessibility Panel ──────────────────────────────────────────────────────
function A11yPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const [state, setState] = useState<A11yState>(loadA11y)
  const [guideY, setGuideY] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  const set = (patch: Partial<A11yState>) => setState(s => ({ ...s, ...patch }))

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't close if clicking the a11y toggle button itself
        const target = e.target as HTMLElement
        if (target.closest('[data-a11y-toggle]')) return
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Persist
  useEffect(() => {
    try { localStorage.setItem('lc_a11y', JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  // Font size
  useEffect(() => { document.documentElement.style.fontSize = `${state.fontSize}%` }, [state.fontSize])

  // Letter spacing
  useEffect(() => {
    document.body.style.letterSpacing = state.letterSpacing > 0 ? `${state.letterSpacing * 0.05}em` : ''
  }, [state.letterSpacing])

  // Line height
  useEffect(() => {
    document.body.style.lineHeight = state.lineHeight > 0 ? `${1.5 + state.lineHeight * 0.25}` : ''
  }, [state.lineHeight])

  // High contrast
  useEffect(() => { document.body.classList.toggle('a11y-high-contrast', state.highContrast) }, [state.highContrast])

  // Underline links
  useEffect(() => { document.body.classList.toggle('a11y-underline-links', state.underlineLinks) }, [state.underlineLinks])

  // Dyslexia font
  useEffect(() => {
    document.body.classList.toggle('a11y-dyslexia', state.dyslexiaFont)
    if (state.dyslexiaFont && !document.getElementById('opendyslexic-font')) {
      const link = document.createElement('link')
      link.id = 'opendyslexic-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.cdnfonts.com/css/opendyslexic'
      document.head.appendChild(link)
    }
  }, [state.dyslexiaFont])

  // Large cursor
  useEffect(() => { document.body.classList.toggle('a11y-large-cursor', state.cursorLarge) }, [state.cursorLarge])

  // Reading guide mouse tracker
  useEffect(() => {
    if (!state.readingGuide) return
    const handler = (e: MouseEvent) => setGuideY(e.clientY)
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [state.readingGuide])

  const reset = () => {
    setState({ ...A11Y_DEFAULTS })
    document.documentElement.style.fontSize = '100%'
    document.body.style.letterSpacing = ''
    document.body.style.lineHeight = ''
    document.body.classList.remove('a11y-high-contrast', 'a11y-underline-links', 'a11y-dyslexia', 'a11y-large-cursor')
  }

  const ToggleBtn = ({ label, active, onClick, icon: Icon }: {
    label: string; active: boolean; onClick: () => void; icon: React.ElementType
  }) => (
    <button onClick={onClick} aria-pressed={active} aria-label={label}
      className={`w-full py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between px-3 min-h-[34px] ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
      }`}>
      <span className="flex items-center gap-2"><Icon size={13} /> {label}</span>
      <span className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 inline-flex items-center ${active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <span className={`absolute w-4 h-4 rounded-full shadow-sm transition-all duration-200 bg-white ${active ? 'left-[18px]' : 'left-[2px]'}`} />
      </span>
    </button>
  )

  const StepControl = ({ label, value, onDec, onInc, min, max }: {
    label: string; value: number; onDec: () => void; onInc: () => void; min: number; max: number
  }) => (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <button onClick={onDec} disabled={value <= min} aria-label={`Decrease ${label}`}
          className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-40 transition-colors">
          <Minus size={12} />
        </button>
        <span className="flex-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">{value}</span>
        <button onClick={onInc} disabled={value >= max} aria-label={`Increase ${label}`}
          className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-40 transition-colors">
          <Plus size={12} />
        </button>
      </div>
    </div>
  )

  return createPortal(
    <>
      {/* Reading guide overlay */}
      {state.readingGuide && (
        <div aria-hidden="true" className="pointer-events-none fixed left-0 right-0 z-[9998]"
          style={{ top: guideY - 16, height: 32, background: 'rgba(59,130,246,0.12)', borderTop: '1px solid rgba(59,130,246,0.3)', borderBottom: '1px solid rgba(59,130,246,0.3)' }} />
      )}
      <div ref={panelRef} role="dialog" aria-label="Accessibility settings"
        className="fixed bottom-[7.5rem] right-6 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] border-2 border-gray-200 dark:border-gray-700 p-3 z-[9999] max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-blue-600" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">{t('a11y.title')}</h2>
          </div>
          <button onClick={onClose} aria-label="Close accessibility panel"
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-2">
          <StepControl label={`${t('a11y.text_size')} (${state.fontSize}%)`} value={state.fontSize} min={80} max={150}
            onDec={() => set({ fontSize: Math.max(80, state.fontSize - 10) })}
            onInc={() => set({ fontSize: Math.min(150, state.fontSize + 10) })} />
          <StepControl label={`${t('a11y.letter_spacing')} (${state.letterSpacing})`} value={state.letterSpacing} min={0} max={5}
            onDec={() => set({ letterSpacing: Math.max(0, state.letterSpacing - 1) })}
            onInc={() => set({ letterSpacing: Math.min(5, state.letterSpacing + 1) })} />
          <StepControl label={`${t('a11y.line_height')} (${state.lineHeight})`} value={state.lineHeight} min={0} max={4}
            onDec={() => set({ lineHeight: Math.max(0, state.lineHeight - 1) })}
            onInc={() => set({ lineHeight: Math.min(4, state.lineHeight + 1) })} />

          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 space-y-1.5">
            <ToggleBtn label={t('a11y.high_contrast_label')} active={state.highContrast}
              onClick={() => set({ highContrast: !state.highContrast })} icon={Contrast} />
            <ToggleBtn label={t('a11y.underline_links_label')} active={state.underlineLinks}
              onClick={() => set({ underlineLinks: !state.underlineLinks })} icon={Underline} />
            <ToggleBtn label={t('a11y.dyslexia_font')} active={state.dyslexiaFont}
              onClick={() => set({ dyslexiaFont: !state.dyslexiaFont })} icon={Type} />
            <ToggleBtn label={t('a11y.reading_guide')} active={state.readingGuide}
              onClick={() => set({ readingGuide: !state.readingGuide })} icon={BookOpen} />
            <ToggleBtn label={t('a11y.large_cursor')} active={state.cursorLarge}
              onClick={() => set({ cursorLarge: !state.cursorLarge })} icon={MousePointer2} />
            <ToggleBtn label={t('a11y.wide_spacing')} active={state.letterSpacing >= 3}
              onClick={() => set({ letterSpacing: state.letterSpacing >= 3 ? 0 : 3 })} icon={AlignJustify} />
          </div>

          <button onClick={reset} aria-label="Reset all accessibility settings"
            className="w-full py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 min-h-[36px]">
            <RotateCcw size={12} /> {t('a11y.reset_all')}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 text-center">W3C WCAG 2.1 AA</p>
      </div>
    </>,
    document.body
  )
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "What does Leonard do?",
  "Book Leonard to speak",
  "View latest articles",
  "Contact Leonard",
]

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('ai_balloon.greeting') }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement
        if (target.closest('[data-chat-toggle]')) return
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: text }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const responses: Record<string, string> = {
      "What does Leonard do?": "Leonard Chan, MH is a technology innovator, AI governance advocate, and public policy leader in Hong Kong. He's CEO of tag.digital, Board Member of AIRDI, Deputy Chairman of HKIRC, and DevCom Chairman of TIA.",
      "Book Leonard to speak": "Leonard speaks on AI governance, cybersecurity, GBA digital economy, and Hong Kong's tech future. Visit the Speaking page or use the Contact form to book him.",
      "View latest articles": "Leonard writes regularly for 大公報 (Ta Kung Pao) and Capital magazine. Check the Insights page for his latest columns on AI policy and Hong Kong's digital blueprint.",
      "Contact Leonard": "You can reach Leonard via the Contact page at leonardchan.com/contact. He's open to consulting, speaking, and collaboration opportunities.",
    }
    const reply = responses[text] || "Thank you for your message! For detailed enquiries, please use the Contact page and Leonard's team will get back to you promptly."
    setMessages(m => [...m, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return createPortal(
    <div ref={panelRef} role="dialog" aria-label="Chat with Leonard's AI assistant" aria-live="polite"
      className="fixed bottom-[7.5rem] right-6 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] border-2 border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-[9999]"
      style={{ maxHeight: '480px' }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Leonard's Assistant</p>
            <p className="text-gray-400 text-xs">Powered by AI</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat"
          className="text-gray-400 hover:text-white transition-colors p-1">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px', maxHeight: '280px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-3 py-2">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-100 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder={t('ai_balloon.placeholder')} aria-label="Chat message input"
          className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} aria-label="Send message"
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <Send size={15} />
        </button>
      </div>
    </div>,
    document.body
  )
}

// ─── Main FloatingButtons Component ──────────────────────────────────────────
export default function FloatingButtons() {
  const [showA11y, setShowA11y] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const toggleA11y = useCallback(() => {
    setShowA11y(v => !v)
    setShowChat(false)
  }, [])

  const toggleChat = useCallback(() => {
    setShowChat(v => !v)
    setShowA11y(false)
  }, [])

  return (
    <>
      {/* Panels rendered via portals — completely independent of button positioning */}
      {showA11y && <A11yPanel onClose={() => setShowA11y(false)} />}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}

      {/* Floating action buttons */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-row items-end gap-2"
        role="region" aria-label="Page utilities">

        {/* Back to Top */}
        {showBackToTop && (
          <button onClick={scrollToTop} aria-label="Back to top"
            className="w-11 h-11 rounded-full bg-gray-700 dark:bg-gray-600 text-white shadow-lg flex items-center justify-center hover:bg-gray-600 dark:hover:bg-gray-500 hover:scale-110 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <ChevronUp size={20} />
          </button>
        )}

        {/* Accessibility — Eye icon */}
        <button
          data-a11y-toggle
          onClick={toggleA11y}
          aria-expanded={showA11y}
          aria-label="Accessibility options"
          className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
            showA11y
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-blue-600 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
          }`}
        >
          <Eye size={20} />
        </button>

        {/* AI Chat */}
        <button
          data-chat-toggle
          onClick={toggleChat}
          aria-expanded={showChat}
          aria-label="Open AI assistant chat"
          className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
        >
          {showChat ? <X size={20} /> : <MessageCircle size={20} />}
          {!showChat && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center" aria-hidden="true">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
          )}
        </button>
      </div>
    </>
  )
}
