import type { SiteLinks } from './types'

export const SITE: SiteLinks = {
  name: 'Ravellino Suwandi',
  email: 'ravell.swnd7@gmail.com',
  cv: 'https://drive.google.com/file/d/1u87Io60ToDB9KmkbkTbAaSZxoAreWLhm/view?usp=sharing',
  linkedin: 'https://www.linkedin.com/in/ravell-swnd',
  github: 'https://github.com/ravellswdd',
  instagram: 'https://www.instagram.com/ravll_swd',
}

export const ROOMS = [
  { id: 'about', label: 'About', sign: '1' },
  { id: 'experience', label: 'Experience', sign: '2' },
  { id: 'work', label: 'Work', sign: '3' },
  { id: 'contact', label: 'Contact', sign: 'i' },
] as const

export type RoomId = (typeof ROOMS)[number]['id']

/**
 * Room 1: the curator's statement. Phrases in *asterisks* are the key phrases: the picture light
 * underlines them once their line is lit.
 */
export const STATEMENT =
  "I'm a developer and *Intelligent Systems* undergraduate at *BINUS*, and an *AI enthusiast* who builds the systems behind the model: Python services that connect *LLM APIs* to real data and tools, with a React and TypeScript interface on top."
