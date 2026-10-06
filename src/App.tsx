import { lazy, Suspense, type ComponentType } from 'react'
import { Nav } from './sections/Nav'
import { EntranceHall } from './sections/EntranceHall'
import { Statement } from './sections/Statement'
import { Loader } from './hall/Loader'

// Everything below the first two rooms loads as its own chunk, so the browser only has to run
// the hall's code before the first paint. The chunks start downloading straight away.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })))
const Collection = named(() => import('./sections/Collection'), 'Collection')
const Experience = named(() => import('./sections/Experience'), 'Experience')
const Gallery = named(() => import('./sections/Gallery'), 'Gallery')
const VisitorDesk = named(() => import('./sections/VisitorDesk'), 'VisitorDesk')
const SiteFooter = named(() => import('./sections/VisitorDesk'), 'SiteFooter')
const FluidCursor = named(() => import('./components/ui/FluidCursor'), 'FluidCursor')

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <EntranceHall />
        <Statement />
        <Suspense>
          <Collection />
          <Experience />
          <Gallery />
          <VisitorDesk />
        </Suspense>
      </main>
      <Suspense>
        <SiteFooter />
        <FluidCursor />
      </Suspense>
      <Loader />
    </>
  )
}

export default App
