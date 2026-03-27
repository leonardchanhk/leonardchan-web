import { useState, useEffect } from 'react'
import { Eye, Type, Contrast, Underline, RotateCcw, X, AlignJustify, Minus, Plus, BookOpen, MousePointer2 } from 'lucide-react'

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

const DEFAULTS: A11yState = {
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 0,
  highContrast: false,
  underlineLinks: false,
  dyslexiaFont: false,
  readingGuide: false,
  cursorLarge: false,
}

function loadState(): A11yState {
  try {
    const saved = localStorage.getItem('lc_a11y')
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return { ...DEFAULTS }
}

export default function A11yWidget() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<A11yState>(loadState)
  const [guideY, setGuideY] = useState(0)

  const set = (patch: Partial<A11yState>) =>
    setState(s => ({ ...s, ...patch }))

  // Persist
  useEffect(() => {
    try { localStorage.setItem('lc_a11y', JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  // Font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${state.fontSize}%`
  }, [state.fontSize])

  // Letter spacing
  useEffect(() => {
    document.body.style.letterSpacing = state.letterSpacing > 0 ? `${state.letterSpacing * 0.05}em` : ''
  }, [state.letterSpacing])

  // Line height
  useEffect(() => {
    document.body.style.lineHeight = state.lineHeight > 0 ? `${1.5 + state.lineHeight * 0.25}` : ''
  }, [state.lineHeight])

  // High contrast
  useEffect(() => {
    document.body.classList.toggle('a11y-high-contrast', state.highContrast)
  }, [state.highContrast])

  // Underline links
  useEffect(() => {
    document.body.classList.toggle('a11y-underline-links', state.underlineLinks)
  }, [state.underlineLinks])

  // Dyslexia font
  useEffect(() => {
    document.body.classList.toggle('a11y-dyslexia', state.dyslexiaFont)
    if (state.dyslexiaFont) {
      if (!document.getElementById('opendyslexic-font')) {
        const link = document.createElement('link')
        link.id = 'opendyslexic-font'
        link.rel = 'stylesheet'
        link.href = 'https://fonts.cdnfonts.com/css/opendyslexic'
        document.head.appendChild(link)
      }
    }
  }, [state.dyslexiaFont])

  // Large cursor
  useEffect(() => {
    document.body.classList.toggle('a11y-large-cursor', state.cursorLarge)
  }, [state.cursorLarge])

  // Reading guide mouse tracker
  useEffect(() => {
    if (!state.readingGuide) return
    const handler = (e: MouseEvent) => setGuideY(e.clientY)
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [state.readingGuide])

  const reset = () => setState({ ...DEFAULTS })

  const ToggleBtn = ({
    label, active, onClick, icon: Icon,
  }: { label: string; active: boolean; onClick: () => void; icon: React.ElementType }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`w-full py-2.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  )

  const StepControl = ({
    label, value, onDec, onInc, min, max,
  }: { label: string; value: number; onDec: () => void; onInc: () => void; min: number; max: number }) => (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <button onClick={onDec} disabled={value <= min} aria-label={`Decrease ${label}`}
          className="flex-1 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-40 transition-colors flex items-center justify-center min-h-[44px]">
          <Minus size={12} />
        </button>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-center">{value}</span>
        <button onClick={onInc} disabled={value >= max} aria-label={`Increase ${label}`}
          className="flex-1 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-40 transition-colors flex items-center justify-center min-h-[44px]">
          <Plus size={12} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Reading guide overlay */}
      {state.readingGuide && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 right-0 z-[9998]"
          style={{ top: guideY - 16, height: 32, background: 'rgba(59,130,246,0.12)', borderTop: '1px solid rgba(59,130,246,0.3)', borderBottom: '1px solid rgba(59,130,246,0.3)' }}
        />
      )}

      <div className="fixed bottom-[7.5rem] right-4 z-[9999]" role="region" aria-label="Accessibility controls">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Accessibility options"
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <Eye size={20} />
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Accessibility settings"
            className="absolute bottom-14 right-0 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-blue-600" />
                <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Accessibility</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close accessibility panel"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Text size */}
              <StepControl
                label={`Text Size (${state.fontSize}%)`}
                value={state.fontSize}
                min={80} max={150}
                onDec={() => set({ fontSize: Math.max(80, state.fontSize - 10) })}
                onInc={() => set({ fontSize: Math.min(150, state.fontSize + 10) })}
              />

              {/* Letter spacing */}
              <StepControl
                label={`Letter Spacing (${state.letterSpacing})`}
                value={state.letterSpacing}
                min={0} max={5}
                onDec={() => set({ letterSpacing: Math.max(0, state.letterSpacing - 1) })}
                onInc={() => set({ letterSpacing: Math.min(5, state.letterSpacing + 1) })}
              />

              {/* Line height */}
              <StepControl
                label={`Line Height (${state.lineHeight})`}
                value={state.lineHeight}
                min={0} max={4}
                onDec={() => set({ lineHeight: Math.max(0, state.lineHeight - 1) })}
                onInc={() => set({ lineHeight: Math.min(4, state.lineHeight + 1) })}
              />

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                <ToggleBtn label="High Contrast" active={state.highContrast}
                  onClick={() => set({ highContrast: !state.highContrast })} icon={Contrast} />
                <ToggleBtn label="Underline Links" active={state.underlineLinks}
                  onClick={() => set({ underlineLinks: !state.underlineLinks })} icon={Underline} />
                <ToggleBtn label="Dyslexia-Friendly Font" active={state.dyslexiaFont}
                  onClick={() => set({ dyslexiaFont: !state.dyslexiaFont })} icon={Type} />
                <ToggleBtn label="Reading Guide" active={state.readingGuide}
                  onClick={() => set({ readingGuide: !state.readingGuide })} icon={BookOpen} />
                <ToggleBtn label="Large Cursor" active={state.cursorLarge}
                  onClick={() => set({ cursorLarge: !state.cursorLarge })} icon={MousePointer2} />
                <ToggleBtn label="Wide Text Spacing" active={state.letterSpacing >= 3}
                  onClick={() => set({ letterSpacing: state.letterSpacing >= 3 ? 0 : 3 })} icon={AlignJustify} />
              </div>

              {/* Reset */}
              <button
                onClick={reset}
                aria-label="Reset all accessibility settings"
                className="w-full py-2.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw size={14} /> Reset All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
