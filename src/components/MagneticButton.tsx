import { useRef, useCallback } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number // pull strength 0–1, default 0.35
  as?: 'button' | 'a' | 'div'
  [key: string]: unknown
}

/**
 * MagneticButton — the element gently pulls toward the cursor when hovered,
 * then springs back when the cursor leaves.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * strength
        const dy = (e.clientY - cy) * strength
        el.style.transform = `translate(${dx}px, ${dy}px)`
        el.style.transition = 'transform 0.1s linear'
      })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...(props as any)}
    >
      {children}
    </Tag>
  )
}
