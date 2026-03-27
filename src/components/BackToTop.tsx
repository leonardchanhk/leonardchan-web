import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('a11y.back_to_top')}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <ArrowUp size={20} />
    </button>
  )
}
