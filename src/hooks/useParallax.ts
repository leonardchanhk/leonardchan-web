import { useEffect, useRef, useState } from 'react'

/**
 * useParallax — attaches a scroll listener and returns a CSS transform string
 * that shifts the element vertically at `speed` fraction of scroll offset.
 *
 * speed: 0.0 = no movement, 0.5 = half speed (default), 1.0 = full scroll speed
 * direction: 'up' (element moves up as page scrolls down) | 'down' (moves down)
 */
export function useParallax(speed = 0.3, direction: 'up' | 'down' = 'up') {
  const ref = useRef<HTMLElement | null>(null)
  const [transform, setTransform] = useState('translateY(0px)')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const update = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const viewH = window.innerHeight
      // How far the element centre is from viewport centre
      const offset = (rect.top + rect.height / 2) - viewH / 2
      const shift = offset * speed * (direction === 'up' ? -1 : 1)
      setTransform(`translateY(${shift.toFixed(1)}px)`)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update() // initial position
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed, direction])

  return { ref, transform }
}

/**
 * useParallaxBg — returns a backgroundPositionY value for CSS background parallax.
 * Attach the returned ref to the section element.
 */
export function useParallaxBg(speed = 0.2) {
  const ref = useRef<HTMLElement | null>(null)
  const [bgPos, setBgPos] = useState('50% 50%')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const update = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const progress = (viewH - rect.top) / (viewH + rect.height)
      const shift = (progress - 0.5) * speed * 100
      setBgPos(`50% ${(50 + shift).toFixed(1)}%`)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  return { ref, bgPos }
}
