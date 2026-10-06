// Row layout follows 21st.dev "Impact Experience" (uilayout.contact): a bold resume list of
// number, role and organisation, without its hover image (DESIGN.md 6.4 drops the popup).
// Motion is DESIGN.md's Pamidor-style scrub: each row slides in from the right in three layers.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { RoomSign } from '../components/ui/RoomSign'
import { EXPERIENCE, EXPERIENCE_GROUPS } from '../data/experience'
import { ExperienceRow } from '../experience/ExperienceRow'
import { useReducedMotion } from '../motion/useReducedMotion'
import '../experience/experience.css'

/** Room 2: the chronology, split into technical (IT) and non-technical, newest first in each. */
export function Experience() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // The title drifts gently left while the section is on screen, lined up with the rows midway.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const titleX = useTransform(scrollYProgress, [0, 1], ['3vw', '-3vw'])

  return (
    <section ref={ref} id="experience" aria-labelledby="exp-h" className="exp">
      <div className="mx-auto max-w-[1320px] px-[var(--gut)]">
        <RoomSign sign="2" as="p">
          Chronology
        </RoomSign>
        <motion.h2 id="exp-h" className="exp-title" style={reduced ? undefined : { x: titleX }}>
          Experience
        </motion.h2>
        {EXPERIENCE_GROUPS.map((group) => {
          const rows = EXPERIENCE.filter((r) => r.track === group.track)
          return (
            <div key={group.track} className="exp-group">
              <div className="exp-group-h">
                <h3 id={`exp-${group.track}`} className="exp-group-title">
                  {group.label} <span className="exp-group-note">{group.note}</span>
                </h3>
                <span className="exp-group-count">
                  {String(rows.length).padStart(2, '0')} {rows.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <ol className="exp-rows" aria-labelledby={`exp-${group.track}`}>
                {rows.map((row, i) => (
                  <ExperienceRow key={row.title + row.org} row={row} index={i} reduced={reduced} />
                ))}
              </ol>
            </div>
          )
        })}
      </div>
    </section>
  )
}
