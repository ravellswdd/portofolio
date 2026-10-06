// "Lit wall text": the statement is lettering on the gallery wall, read under the curator's picture
// light. Each line slides into place along the wall (alternate lines from alternate sides, like
// panels on a hanging rail), then a warm light sweeps along it and the letters it passes are lit.
// Once a line is lit, its key phrases are underlined. Splitting the text into its real lines, and
// marking emphasis inline, follow 21st.dev "Text Reveal (Mask)" (soralabs); the slide, the light
// and the underlines are this exhibition's own. Each line is drawn once (the lit colour is a
// gradient clipped to the text), so selecting or copying the statement reads normally.
import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'motion/react'
import { RoomSign } from '../components/ui/RoomSign'
import { STATEMENT } from '../data/site'
import { Portrait } from './Portrait'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../motion/useReducedMotion'

interface Word {
  text: string
  /** Punctuation after the word, outside the underline */
  tail: string
  em: boolean
  /** The underline carries on over the following space (the phrase continues) */
  joins: boolean
}

/** "*Intelligent Systems* at *BINUS*," into words, each knowing whether it is a key phrase. */
function parse(src: string): Word[] {
  let open = false
  const words = src.split(/\s+/).map((raw) => {
    let t = raw
    const starts = t.startsWith('*')
    if (starts) t = t.slice(1)
    const close = t.indexOf('*')
    const em = open || starts
    let tail = ''
    if (close >= 0) {
      tail = t.slice(close + 1)
      t = t.slice(0, close)
      open = false
    } else if (starts) open = true
    return { text: t, tail, em, joins: em && open }
  })
  return words
}

const WORDS = parse(STATEMENT)

function WordSpan({
  w,
  last,
  lineEnd = false,
  underline,
}: {
  w: Word
  last: boolean
  /** Last word on its line: the underline stops at the word, even if the phrase carries on */
  lineEnd?: boolean
  underline?: MotionValue<number>
}) {
  return (
    <>
      <span className="st-word" data-w>
        {w.em ? (
          <span className={`st-em${w.joins && !lineEnd ? ' joins' : ''}`}>
            {w.text}
            <motion.i aria-hidden style={underline ? { scaleX: underline } : undefined} />
          </span>
        ) : (
          w.text
        )}
        {w.tail}
      </span>
      {!last && ' '}
    </>
  )
}

/** One line of the statement: slides in, is swept by the light, then its key phrases are underlined. */
function Line({
  words,
  first,
  index,
  count,
  progress,
}: {
  words: Word[]
  first: number
  index: number
  count: number
  progress: MotionValue<number>
}) {
  // Each line has its own stretch of the scroll; neighbouring stretches overlap so it flows.
  const a = index / (count + 0.8)
  const b = (index + 1.8) / (count + 0.8)
  const t = useTransform(progress, [a, b], [0, 1], { clamp: true })
  const dir = index % 2 ? -1 : 1
  const x = useTransform(t, [0, 0.4], [`${dir * 3.5}vw`, '0vw'], { clamp: true })
  const opacity = useTransform(t, [0, 0.3], [0.06, 1], { clamp: true })
  // The light travels from just before the line to just past it.
  const lit = useTransform(t, [0.3, 0.92], [-12, 112], { clamp: true })
  const glow = useTransform(t, [0.3, 0.45, 0.85, 0.98], [0, 1, 1, 0], { clamp: true })
  const underline = useTransform(t, [0.88, 1], [0, 1], { clamp: true })
  const fill = useMotionTemplate`linear-gradient(90deg, var(--ink) calc(${lit}% - 8%), var(--ink-2) calc(${lit}% + 8%))`
  const glowLeft = useMotionTemplate`${lit}%`

  return (
    <motion.span className="st-line" style={{ x, opacity }}>
      <motion.span className="st-glow" aria-hidden style={{ left: glowLeft, opacity: glow }} />
      <motion.span className="st-ink" style={{ backgroundImage: fill }}>
        {words.map((w, i) => (
          // the space after a line's last word stays in the text, so copying reads normally
          <WordSpan
            key={first + i}
            w={w}
            last={first + i === WORDS.length - 1}
            lineEnd={i === words.length - 1}
            underline={underline}
          />
        ))}
      </motion.span>
    </motion.span>
  )
}

/**
 * Room 1, first wall: the curator's statement next to a framed photograph.
 * Desktop: the room pins in place (a tall track with a sticky inside) while the lines slide in and
 * are lit one by one; then the page carries on. Phones: the content is taller than the screen, so
 * it scrolls normally and the lines play as the paragraph passes. Reduced motion: lit and still.
 */
export function Statement() {
  const trackRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 901px)')
  const pin = desktop && !reduced
  // Pinned: progress along the track (the lines play from 6% to 86% of it, a beat of rest each end).
  const track = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  }).scrollYProgress
  const pinned = useTransform(track, [0.06, 0.86], [0, 1])
  // Not pinned: plays while the paragraph travels from low on the screen to just above the middle.
  const flowing = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.5'],
  }).scrollYProgress
  const scrollYProgress = pin ? pinned : flowing

  // Where the text wraps: measured from the laid-out words, again whenever the width changes.
  const [lines, setLines] = useState<number[] | null>(null)
  useLayoutEffect(() => {
    if (reduced || lines) return
    const p = textRef.current
    if (!p) return
    const starts: number[] = []
    let top = -Infinity
    p.querySelectorAll<HTMLElement>('[data-w]').forEach((el, i) => {
      if (el.offsetTop > top + 2) {
        starts.push(i)
        top = el.offsetTop
      }
    })
    setLines(starts)
  }, [reduced, lines])
  useLayoutEffect(() => {
    const p = textRef.current
    if (!p || reduced) return
    let width = p.clientWidth
    const remeasure = () => {
      if (p.clientWidth === width) return
      width = p.clientWidth
      setLines(null)
    }
    const ro = new ResizeObserver(remeasure)
    ro.observe(p)
    // web fonts change the wrapping once they arrive
    document.fonts?.ready.then(() => setLines(null))
    return () => ro.disconnect()
  }, [reduced])

  return (
    <section
      id="about"
      aria-labelledby="about-h"
      className="overflow-x-clip bg-wall pt-[clamp(72px,10vw,140px)] pb-[clamp(48px,6vw,80px)]"
    >
      <div ref={trackRef} className={pin ? 'st-track' : undefined}>
        <div className={`mx-auto max-w-[1320px] px-[var(--gut)]${pin ? ' st-pin' : ''}`}>
          <RoomSign sign="1" id="about-h">
            Curator&rsquo;s statement
          </RoomSign>

          <div className="grid items-center gap-[clamp(28px,6vw,96px)] min-[901px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
            <Portrait />

            <p
              ref={textRef}
              className={`st-text max-w-[30ch] font-display text-[clamp(1.5rem,3.1vw,2.6rem)] leading-[1.18] font-medium tracking-[-0.025em] text-pretty text-ink${lines && !reduced ? ' is-lines' : ''}`}
            >
              {reduced || !lines
                ? WORDS.map((w, i) => <WordSpan key={i} w={w} last={i === WORDS.length - 1} />)
                : lines.map((start, li) => {
                    const end = lines[li + 1] ?? WORDS.length
                    return (
                      <Line
                        key={`${start}-${end}`}
                        words={WORDS.slice(start, end)}
                        first={start}
                        index={li}
                        count={lines.length}
                        progress={scrollYProgress}
                      />
                    )
                  })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
