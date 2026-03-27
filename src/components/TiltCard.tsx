import { useRef, useCallback } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number // 0–20, default 10
  glare?: boolean
}

/**
 * TiltCard — wraps children in a 3D perspective tilt that follows the cursor.
 * On mouse-leave it springs back to flat. Works with any content.
 */
export default function TiltCard({
  children,
  className = '',
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width  // 0–1
        const y = (e.clientY - rect.top) / rect.height   // 0–1
        const rotateX = (0.5 - y) * intensity * 2        // positive = tilt top toward viewer
        const rotateY = (x - 0.5) * intensity * 2        // positive = tilt right toward viewer

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
        card.style.transition = 'transform 0.08s linear'

        if (glare && glareRef.current) {
          const glareX = x * 100
          const glareY = y * 100
          glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`
          glareRef.current.style.opacity = '1'
        }
      })
    },
    [intensity, glare]
  )

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }, [glare])

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ opacity: 0, transition: 'opacity 0.2s ease', zIndex: 10, borderRadius: 'inherit' }}
        />
      )}
    </div>
  )
}
