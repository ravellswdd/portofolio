import { useMemo, useRef, type CSSProperties, type PointerEvent } from 'react'
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { ButtonLink } from '../components/ui/Button'
import { Picture } from '../components/ui/Picture'
import { SITE } from '../data/site'
import { DustMotes } from '../hall/DustMotes'
import { useGateOpen } from '../hall/gate'
import { at, INTRO } from '../hall/intro'
import { plasterTexture } from '../hall/plaster'
import { SoftBlurIn } from '../hall/SoftBlurIn'
import { StanchionShadows, Stanchions } from '../hall/Stanchions'
import { TrackLight } from '../hall/TrackLight'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../motion/useReducedMotion'
import './entrance-hall.css'

const EASE = [0.22, 1, 0.36, 1] as const

const TILT_SPRING = { stiffness: 90, damping: 22, mass: 1 }

/**
 * Entrance hall: the latest project (BagiBagi) hung on a lit gallery wall behind a velvet rope.
 * Already lit when the loading screen lifts: the camera settles back and the lettering comes in
 * (timings in hall/intro.ts, started by the entrance gate). Desktop (>900px) adds pointer tilt with depth and
 * a scroll recede; smaller screens are stacked and flat. Reduced motion: lit and still.
 *
 * The wall lettering (name, line, buttons) sits outside the 3D scene: it never tilts, scales or
 * softens, it stays put like vinyl on the wall while the room moves around the portrait.
 */
export function EntranceHall() {
  const hallRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 901px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const inView = useInView(hallRef)
  const depth = desktop && !reduced
  const tilt = depth && finePointer

  // The opening plays once the loading screen starts to lift.
  const play = useGateOpen()
  // The spotlight is on from the start (TrackLight and the floor spill read it as a motion value).
  const light = useMotionValue(1)

  // Pointer tilt: -1..1 across the hall, smoothed with a spring.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, TILT_SPRING)
  const sy = useSpring(py, TILT_SPRING)
  const rotateY = useTransform(sx, (v) => v * 4.5)
  const rotateX = useTransform(sy, (v) => v * -3.5)
  // Reflections slide against the viewpoint: on the picture glass and on the chrome posts.
  const glassX = useTransform(sx, [-1, 1], ['14%', '-14%'])
  const shine = useTransform(sx, [-1, 1], [2.2, -2.2])

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  // Scroll recede: step back from the entrance (Photos-app zoom-out) while the hall scrolls away.
  const { scrollYProgress } = useScroll({ target: hallRef, offset: ['start start', 'end start'] })
  const recedeZ = useTransform(scrollYProgress, [0, 0.9], [0, -220])
  const recedeRX = useTransform(scrollYProgress, [0, 0.9], [0, 7])
  const recedeY = useTransform(scrollYProgress, [0, 0.9], ['0%', '-5%'])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0.3])

  const plaster = useMemo(() => ({ '--plaster': plasterTexture() }) as CSSProperties, [])
  const camera = at('cameraSettle')
  // Reduced motion: everything is simply there (Motion's reducedMotion only drops transforms,
  // it would still fade these in after their delays).
  const fadeUp = (step: Parameters<typeof at>[0], y = 14) => ({
    initial: reduced ? false : { opacity: 0, y, filter: 'blur(6px)' },
    animate: play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { ...at(step), ease: EASE },
  })

  return (
    <section
      id="top"
      ref={hallRef}
      aria-label="Entrance"
      className="hall"
      data-inview={inView || undefined}
      onPointerMove={tilt ? onPointerMove : undefined}
      onPointerLeave={tilt ? onPointerLeave : undefined}
    >
      {/* Wall lettering: outside the 3D scene, so it stays still and crisp */}
      <div className="h-text">
        <motion.p className="h-now" {...fadeUp('now', 8)}>
          Now showing
        </motion.p>
        <h1 className="h-name">
          <SoftBlurIn className="ln" {...at('name')} stagger={INTRO.name.stagger} play={play}>
            Ravellino
          </SoftBlurIn>{' '}
          <SoftBlurIn
            className="ln"
            {...at('name')}
            delay={INTRO.name.delay + 0.25}
            stagger={INTRO.name.stagger}
            play={play}
          >
            Suwandi
          </SoftBlurIn>
        </h1>
        <motion.p className="h-sub" {...fadeUp('sub')}>
          A solo exhibition of models, interfaces and projects by an AI Enthusiast and CS student.
        </motion.p>
        <motion.div className="h-ctas" {...fadeUp('ctas')}>
          <ButtonLink href="#work">View work</ButtonLink>
          <ButtonLink variant="ghost" href={SITE.cv} target="_blank" rel="noopener">
            Download CV
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div className="hall-stage" style={depth ? { opacity: fade } : undefined}>
        {/* Camera settles back while the room lights up */}
        <motion.div
          className="hall-camera"
          initial={reduced || !desktop ? false : { scale: 1.07, y: '2%' }}
          animate={play ? { scale: 1, y: '0%' } : undefined}
          transition={{ ...camera, ease: EASE }}
        >
          <motion.div className="hall-zoom" style={depth ? { z: recedeZ, rotateX: recedeRX, y: recedeY } : undefined}>
            <motion.div className="hall-tilt" style={tilt ? { rotateX, rotateY } : undefined}>
              <div className="h-wall" style={plaster} />
              <div className="h-skirt" />
              <div className="h-floor" style={plaster}>
                <motion.span className="h-floor-spill" style={{ opacity: light }} />
                <StanchionShadows />
              </div>
              <div className="h-track" aria-hidden />

              {/* Spotlight: cone through the air, pool on the wall, dust in the beam */}
              <motion.div className="h-light" aria-hidden style={{ opacity: light }}>
                <span className="h-cone">
                  <span />
                </span>
                <span className="h-pool" />
                {!reduced && <DustMotes />}
              </motion.div>
              <div className="h-fix" aria-hidden>
                <TrackLight glow={light} />
              </div>

              <figure className="h-art">
                <span className="h-frame">
                  <span className="h-lip">
                    <span className="h-mat">
                      <span className="h-window">
                        <Picture
                          image="bagibagi"
                          priority
                          alt="BagiBagi poster: the app's mark, a white tile cut by a blue diagonal, above the line Split the bill without the mental maths"
                          sizes="(max-width: 900px) min(62vw, 266px), clamp(187px, 19.5vw, 296px)"
                        />
                        {/* Picture glass: a resting reflection that moves with the tilt, and one
                            sweep of light across it as the hall opens. */}
                        <motion.span className="h-glass" aria-hidden style={tilt ? { x: glassX } : undefined} />
                        {!reduced && (
                          <motion.span
                            className="h-glint"
                            aria-hidden
                            initial={{ x: '-130%' }}
                            animate={play ? { x: '130%' } : undefined}
                            transition={{ ...at('glare'), ease: [0.4, 0, 0.2, 1] }}
                          />
                        )}
                      </span>
                    </span>
                  </span>
                </span>
                <figcaption className="h-label">
                  <motion.span className="h-label-card" {...fadeUp('label', 10)}>
                    <strong>BagiBagi</strong>
                    Latest work, now live
                    <br />
                    Web app: React, TypeScript, Supabase
                    <span className="gap" />
                    Snap a receipt, tick what you had, and the group&rsquo;s balances settle themselves.
                    <a
                      className="h-label-link"
                      href="https://bagibagiapp.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit the site <ArrowUpRightIcon size={12} weight="bold" aria-hidden />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </motion.span>
                </figcaption>
              </figure>

              <div className="h-rope" aria-hidden>
                <Stanchions shine={tilt ? shine : undefined} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
