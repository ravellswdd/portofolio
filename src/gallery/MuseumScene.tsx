// Loaded lazily (three.js lives in this chunk). Mounts the walkable room from museum.ts and draws
// the HUD over it: the controls hint, full screen, the guided route arrows and the placard of the
// painting in front of the visitor.
import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, CornersInIcon, CornersOutIcon } from '@phosphor-icons/react'
import { PROJECT_COUNT, PROJECTS } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useLenis } from '../motion/lenis-context'
import { useTheme } from '../theme/theme-context'
import { createMuseum, type Museum } from './museum'
import { Placard } from './Placard'

interface Props {
  active: boolean
  onOpen: (index: number) => void
  /** WebGL failed after all: fall back to the carousel */
  onFail: () => void
}

export default function MuseumScene({ active, onOpen, onFail }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const museum = useRef<Museum | null>(null)
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [focus, setFocus] = useState(-1)
  const [hintGone, setHintGone] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [full, setFull] = useState(false)
  // Callbacks can change between renders; the scene keeps calling the latest ones.
  const onOpenRef = useRef(onOpen)
  const exitFullRef = useRef<() => void>(() => {})
  const onFailRef = useRef(onFail)
  useEffect(() => {
    onOpenRef.current = onOpen
    onFailRef.current = onFail
  })

  // Build the room only once it is on screen, in the browser's idle time, so scrolling past the
  // rooms before it never stalls on texture generation and shader compiles.
  useEffect(() => {
    const container = boxRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    let idle = 0
    let cancelled = false
    const build = () => {
      if (cancelled) return
      try {
        museum.current = createMuseum({
          container,
          canvas,
          projects: PROJECTS,
          reduced,
          fine,
          onFocus: setFocus,
          onOpen: (i) => {
            exitFullRef.current()
            onOpenRef.current(i)
          },
          onInteract: () => setHintGone(true),
        })
        setLoaded(true)
      } catch (err) {
        console.warn('3D gallery unavailable, showing the carousel', err)
        onFailRef.current()
      }
    }
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return
        io.disconnect()
        // Safari has no requestIdleCallback: fall back to a short timeout
        idle =
          typeof requestIdleCallback === 'function'
            ? requestIdleCallback(build, { timeout: 600 })
            : setTimeout(build, 50)
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(container)
    return () => {
      cancelled = true
      io.disconnect()
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idle)
      clearTimeout(idle)
      museum.current?.dispose()
      museum.current = null
      setLoaded(false)
    }
    // Built once; theme and active state are pushed in below.
  }, [reduced, fine])

  useEffect(() => {
    museum.current?.setTheme(theme === 'dark')
  }, [theme, loaded])
  useEffect(() => {
    museum.current?.setActive(active)
  }, [active, loaded])

  // Full screen: the real Fullscreen API where the browser allows it on an element (desktop, iPad,
  // Android). iPhone Safari only allows it for video, so there the room is expanded to fill the
  // screen instead ("expanded"), with the page held still behind it.
  const [expanded, setExpanded] = useState(false)
  const lenis = useLenis()
  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === boxRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  useEffect(() => {
    if (!expanded) return
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    html.classList.add('museum-expanded')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false)
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prev
      html.classList.remove('museum-expanded')
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [expanded, lenis])
  const exitFull = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    setExpanded(false)
  }
  exitFullRef.current = exitFull
  const toggleFull = () => {
    const box = boxRef.current
    if (!box) return
    if (document.fullscreenElement || expanded) return exitFull()
    if (document.fullscreenEnabled && box.requestFullscreen) {
      box
        .requestFullscreen()
        .then(() => box.focus())
        .catch(() => setExpanded(true))
    } else setExpanded(true)
  }
  const isFull = full || expanded

  const open = (i: number) => {
    exitFull()
    onOpen(i)
  }

  return (
    <div
      ref={boxRef}
      className={`museum${expanded ? ' is-expanded' : ''}`}
      data-cursor="Drag"
      tabIndex={0}
      role="application"
      aria-roledescription="3D gallery"
      aria-label="3D gallery. Drag to look around, W A S D or arrow keys to walk, click a painting to walk up to it, then click again or press Enter to open it."
    >
      <canvas ref={canvasRef} />
      {!loaded && <div className="museum-loading">Turning on the gallery lights...</div>}
      <div className="crosshair" aria-hidden />
      <div className="hud-top">
        <span className={`keys${hintGone ? ' is-gone' : ''}`} aria-hidden>
          {fine
            ? 'Drag to look · WASD to walk · Click a painting'
            : 'Swipe to look · Tap the floor to walk · Tap a painting'}
        </span>
        <button type="button" className="round" onClick={toggleFull}>
          {isFull ? (
            <CornersInIcon size={18} weight="bold" aria-hidden />
          ) : (
            <CornersOutIcon size={18} weight="bold" aria-hidden />
          )}
          <span className="sr-only">{isFull ? 'Exit full screen' : 'Full screen'}</span>
        </button>
      </div>
      <div className="hud">
        <button type="button" className="round" onClick={() => museum.current?.step(-1)}>
          <ArrowLeftIcon size={18} weight="bold" aria-hidden />
          <span className="sr-only">Walk to the previous painting</span>
        </button>
        <div className="hud-card" aria-live="polite">
          {focus < 0 ? (
            <>
              <h3 className="pl-title">Welcome in</h3>
              <p className="pl-muted">
                {PROJECT_COUNT[0].toUpperCase() + PROJECT_COUNT.slice(1)} works hang in this room, the latest on the far
                wall. Use the arrows for the guided route, or walk around freely.
              </p>
            </>
          ) : (
            <Placard project={PROJECTS[focus]} onEnter={() => open(focus)} />
          )}
        </div>
        <button type="button" className="round" onClick={() => museum.current?.step(1)}>
          <ArrowRightIcon size={18} weight="bold" aria-hidden />
          <span className="sr-only">Walk to the next painting</span>
        </button>
      </div>
    </div>
  )
}
