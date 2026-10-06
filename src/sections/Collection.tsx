import { Banner } from '../collection/Banner'
import { COLLECTION } from '../data/collection'
import '../collection/banners.css'

/** Room 1, second hall: the languages and tools, each printed on its own hanging banner. */
export function Collection() {
  return (
    <section
      aria-labelledby="coll-h"
      className="overflow-x-clip bg-wall pt-[clamp(40px,6vw,80px)] pb-[clamp(72px,10vw,140px)]"
    >
      <div className="mx-auto max-w-[1320px] px-[var(--gut)]">
        <div className="mb-12 flex flex-col gap-2.5">
          <h2 id="coll-h" className="text-[clamp(2rem,4.4vw,3.6rem)]">
            The collection
          </h2>
          <p className="max-w-[56ch] text-ink-2">
            The languages and tools I work with, each printed on its own banner, with where it was used woven in at the
            hem.
          </p>
        </div>
        <ul className="banners">
          {COLLECTION.map((exhibit, i) => (
            <Banner key={exhibit.id} exhibit={exhibit} number={i + 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}
