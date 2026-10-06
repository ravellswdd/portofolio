export interface ResponsiveImage {
  /** Fallback (largest WebP) */
  src: string
  /** Intrinsic size of the largest variant, used for width/height attributes */
  width: number
  height: number
  /** srcset strings, e.g. "/img/intro-400.avif 400w, ..." */
  avif: string
  webp: string
}

export type ProjectKey = 'bagibagi' | 'people' | 'tukangin' | 'sign' | 'fittrack' | 'cateringz' | 'portfolio'

export interface Project {
  key: ProjectKey
  title: string
  type: 'Group project' | 'Personal project' | 'Coursework project'
  /** The main attraction: the big wall in the 3D room and the first painting in the carousel */
  featured?: boolean
  role: string
  when: string
  tools: string[]
  description: string
  /** Project logo used on the painting and in the exhibit dialog */
  image: string
  imageAlt: string
  links: {
    /** The live site, when there is one */
    site?: string
    /** Source code (GitHub or Colab) and where it lives */
    code?: string
    codeLabel?: string
    /** Demo video (YouTube or Drive) */
    demo?: string
  }
}

export interface ExperienceRow {
  /** tech: IT work and projects. nontech: organisation and event roles. */
  track: 'tech' | 'nontech'
  title: string
  org: string
  description: string
  when: string
  current?: boolean
}

/** A logo as SVG paths, each with its own fill (currentColor follows the cloth's ink) */
export interface Mark {
  viewBox: string
  paths: { d: string; fill: string }[]
}

export interface Exhibit {
  /** Short code, shown after the shelf number: LANG01/PY */
  id: string
  /** Shelf the exhibit is catalogued on: languages, libraries or databases */
  shelf: 'LANG' | 'LIB' | 'DB'
  name: string
  kind: string
  usedIn: string
  mark: Mark
  /** Brand colour, used for the ring around the mark */
  color: string
  /** Centrepiece banner (hangs in the middle, larger) */
  centrepiece?: boolean
}

export interface SiteLinks {
  name: string
  email: string
  cv: string
  linkedin: string
  github: string
  instagram: string
}
