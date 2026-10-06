// Ticket follows 21st.dev "Admit One Ticket" (larsen66): a perforated stub, a slight 3D tilt
// toward the pointer and a glare that follows it. Restyled as the museum's admission ticket
// (DESIGN.md 6.6): an open invitation, the email large, Copy email, the social links and a stub with
// the Vels mark, a barcode and today's date as the ticket number. On phones the stub tears off under
// the ticket.
import { useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { RoomSign } from '../components/ui/RoomSign'
import { SITE } from '../data/site'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../motion/useReducedMotion'
import '../desk/visitor-desk.css'

const LINKS = [
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'GitHub', href: SITE.github },
  { label: 'Instagram', href: SITE.instagram },
  { label: 'CV', href: SITE.cv },
]
const TILT = 4

/** Today's date as a ticket number, e.g. No. 06102026 (day, month, year). */
function ticketNo(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}`
}
const SPRING = { stiffness: 180, damping: 22, mass: 0.6 }

export function VisitorDesk() {
  const emailRef = useRef<HTMLAnchorElement>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef(0)
  const reduced = useReducedMotion()
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const tilt = fine && !reduced

  // Pointer over the ticket, -0.5..0.5, smoothed: a slight tilt and a glare that follows it.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)
  const rotateY = useTransform(sx, (v) => v * 2 * TILT)
  const rotateX = useTransform(sy, (v) => v * -2 * TILT)
  const gx = useTransform(sx, [-0.5, 0.5], [10, 90])
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 45%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  const say = (msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2000)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      say('Email copied')
    } catch {
      // No clipboard access (http, old browser): select the address so it can be copied by hand.
      const el = emailRef.current
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      say('Selected. Press Ctrl+C to copy')
    }
  }

  return (
    <section id="contact" aria-labelledby="desk-h" className="desk">
      <div className="mx-auto max-w-[1320px] px-[var(--gut)]">
        <RoomSign sign="i" as="p">
          Visitor desk
        </RoomSign>
        <h2 id="desk-h" className="desk-h">
          Have an idea worth building? Let&rsquo;s make it together.
        </h2>

        <div className="ticket-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
          <motion.div className="ticket" style={tilt ? { rotateX, rotateY } : undefined}>
            <div className="t-main">
              <div className="t-top">
                <span>Open invitation</span>
                <span>RvL's Exhibition</span>
              </div>
              <a ref={emailRef} className="t-email" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              <div className="t-row">
                <button type="button" className="t-copy" onClick={copy}>
                  {toast === 'Email copied' ? (
                    <CheckIcon size={18} weight="bold" aria-hidden />
                  ) : (
                    <CopyIcon size={18} weight="bold" aria-hidden />
                  )}
                  Copy email
                </button>
                <ul className="t-links">
                  {LINKS.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                        <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="t-stub" aria-hidden>
              <span>Visitor pass</span>
              <b>Vel</b>
              <span className="t-barcode" />
              <span className="t-no">No. {ticketNo()}</span>
            </div>
            {tilt && <motion.span className="t-glare" aria-hidden style={{ backgroundImage: glare }} />}
          </motion.div>
        </div>
      </div>

      <div className="toast-slot" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              className="toast"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** The page footer (its own landmark, outside <main>), continuing the visitor desk's wall. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  // Publish the footer's height for the visitor desk's minimum height (see visitor-desk.css).
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const ro = new ResizeObserver(() => root.style.setProperty('--foot-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--foot-h')
    }
  }, [])
  return (
    <footer ref={ref} className="site-foot-wrap">
      <div className="mx-auto max-w-[1320px] px-[var(--gut)]">
        <div className="site-foot">
          <span>&copy; 2026 {SITE.name}</span>
          <a href="#top">Back to the entrance</a>
        </div>
      </div>
    </footer>
  )
}
