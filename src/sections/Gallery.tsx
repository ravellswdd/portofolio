import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { RoomSign } from '../components/ui/RoomSign'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { PROJECT_COUNT, PROJECTS } from '../data/projects'
import { ArcCarousel } from '../gallery/ArcCarousel'
import { ExhibitDialog } from '../gallery/ExhibitDialog'
import { hasWebGL } from '../gallery/webgl'
import '../gallery/gallery.css'

// three.js only downloads when the visitor gets near Room 3.
const MuseumScene = lazy(() => import('../gallery/MuseumScene'))

type Mode = 'walk' | 'carousel'
const MODES = [
  { value: 'walk' as const, label: 'Walk the gallery' },
  { value: 'carousel' as const, label: 'Carousel' },
]

/** Room 3: the projects, as a walkable 3D room or a carousel, each opening an exhibit card. */
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [webgl, setWebgl] = useState(() => hasWebGL())
  const [mode, setMode] = useState<Mode>(() => (hasWebGL() ? 'walk' : 'carousel'))
  const [near, setNear] = useState(false)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || near) return
    const io = new IntersectionObserver(([en]) => en.isIntersecting && setNear(true), { rootMargin: '800px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  const fail = () => {
    setWebgl(false)
    setMode('carousel')
  }

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-h" className="work">
      <div className="mx-auto max-w-[1320px] px-[var(--gut)]">
        <RoomSign sign="3" as="p">
          The gallery
        </RoomSign>
        <div className="work-head">
          <div>
            <h2 id="work-h" className="text-[clamp(2rem,4.4vw,3.6rem)]">
              Selected work
            </h2>
            <p className="work-intro">
              {webgl
                ? `Walk the room in first person, or browse the same ${PROJECT_COUNT} projects as a carousel.`
                : `${PROJECT_COUNT[0].toUpperCase()}${PROJECT_COUNT.slice(1)} projects, hung as an exhibition. Open any painting to see the role, tools and links.`}
            </p>
          </div>
          {webgl && (
            <SegmentedControl<Mode>
              options={MODES}
              label="Gallery view"
              value={mode}
              onValueChange={(v) => setMode(v)}
            />
          )}
        </div>

        {webgl && (
          <div hidden={mode !== 'walk'}>
            {near ? (
              <Suspense fallback={<div className="museum museum-loading">Turning on the gallery lights...</div>}>
                <MuseumScene active={mode === 'walk'} onOpen={setOpenIdx} onFail={fail} />
              </Suspense>
            ) : (
              <div className="museum museum-loading">Turning on the gallery lights...</div>
            )}
          </div>
        )}
        {mode === 'carousel' && <ArcCarousel onOpen={setOpenIdx} />}
      </div>

      <ExhibitDialog
        projects={PROJECTS}
        index={openIdx}
        onClose={() => setOpenIdx(null)}
        onStep={(d) => setOpenIdx((i) => (i === null ? i : (i + d + PROJECTS.length) % PROJECTS.length))}
      />
    </section>
  )
}
