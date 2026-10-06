import cateringz from '../assets/projects/cateringz.png'
import fittrack from '../assets/projects/FitTrack.png'
import tukangin from '../assets/projects/TukangIn.png'
import sign from '../assets/projects/Sign.png'
import portfolio from '../assets/projects/Portfolio.png'
import bagibagi from '../assets/projects/BagiBagi.png'
import people from '../assets/projects/PeopleCounting.png'
import type { Project } from './types'

// Gallery order: the route a visitor walks through the 3D room (left wall front to back, the big
// back wall, then the right wall back to front). The featured project hangs on the back wall and
// is the painting the carousel opens on.
export const PROJECTS: Project[] = [
  {
    key: 'tukangin',
    title: 'TukangIN',
    type: 'Group project',
    role: 'Database Engineer',
    when: 'Feb - Jun 2025',
    tools: ['React', 'TypeScript', 'CSS', 'PostgreSQL'],
    description:
      'A platform that connects people with verified household technicians, with clear pricing across common home services.',
    image: tukangin,
    imageAlt: 'TukangIN logo, a yellow star knot with the line Need Help Fast? TukangIN aja!',
    links: {
      code: 'https://github.com/VincentiusJacob/TukangIN',
      codeLabel: 'GitHub',
      demo: 'https://www.youtube.com/watch?v=8Tdfyb0xTBs',
    },
  },
  {
    key: 'sign',
    title: 'SignScanner',
    type: 'Group project',
    role: 'Machine Learning Engineer Assistant',
    when: 'Feb - Jun 2025',
    tools: ['Python', 'React', 'TypeScript', 'CSS'],
    description:
      'A web app that recognises traffic signs from a photo and explains them, built for travellers reading unfamiliar road signs.',
    image: sign,
    imageAlt: 'SignScanner logo, a magnifier inside an octagonal stop sign',
    links: {
      code: 'https://github.com/VincentiusJacob/TrafficSignScanner',
      codeLabel: 'GitHub',
      demo: 'https://youtube.com/shorts/KOFKf9vU9Vw',
    },
  },
  {
    key: 'people',
    title: 'People Counting',
    type: 'Coursework project',
    role: 'Machine Learning Engineer',
    when: '2025',
    tools: ['Python', 'YOLOv8n', 'CNN'],
    description:
      'A web app that finds and counts people in a live webcam feed or an uploaded photo, boxing each person with a confidence score. I helped build and tune the custom detection model, a CNN trained on YOLOv8n.',
    image: people,
    imageAlt: 'People Counting logo: a person framed by green detection brackets, labelled person 0.94',
    links: {
      site: 'https://people-counting-fl7t.vercel.app/',
    },
  },
  {
    key: 'bagibagi',
    title: 'BagiBagi',
    type: 'Personal project',
    featured: true,
    role: 'Full Stack Developer',
    when: '2026',
    tools: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    description:
      'A bill-splitting app for friends and housemates. Snap a receipt and it reads the items, everyone ticks what they had, tax and discounts are shared in proportion, and every balance in the group stays up to date.',
    image: bagibagi,
    imageAlt:
      'BagiBagi logo: a white tile cut by a blue diagonal, above the line Split the bill without the mental maths',
    links: {
      site: 'https://bagibagiapp.vercel.app/',
    },
  },
  {
    key: 'fittrack',
    title: 'FitTrack',
    type: 'Group project',
    role: 'Machine Learning Engineer',
    when: 'Oct - Dec 2024',
    tools: ['Python'],
    description: 'A food recognition model that identifies a dish from an image and estimates its calories per 100 g.',
    image: fittrack,
    imageAlt: 'FitTrack logo in bold red lettering, labelled Health app',
    links: {
      code: 'https://colab.research.google.com/drive/1VDyjW8DnE_2lMqwJ4qJt5ozyg-b77r6R?usp=sharing',
      codeLabel: 'Colab',
      demo: 'https://drive.google.com/file/d/16GvONIdFFLF6sVOO2Iuas0b15OhS3nl8/view?usp=drive_link',
    },
  },
  {
    key: 'cateringz',
    title: 'CateringZ',
    type: 'Personal project',
    role: 'Full Stack Web Developer',
    when: 'Apr - Jun 2024',
    tools: ['HTML', 'CSS', 'JavaScript'],
    description: 'A web app for ordering healthy meals, with simple meal planning and delivery to your door.',
    image: cateringz,
    imageAlt: 'CateringZ logo in white stencil lettering on green',
    links: {
      code: 'https://github.com/ravellswdd/cateringz',
      codeLabel: 'GitHub',
      demo: 'https://youtu.be/CGfc70pwgAQ',
    },
  },
  {
    key: 'portfolio',
    title: 'RvL Portfolio',
    type: 'Personal project',
    role: 'Frontend Web Developer',
    when: 'Apr - Jun 2025',
    tools: ['React', 'TypeScript', 'CSS'],
    description:
      'The first version of this site, built to practise React and TypeScript and to find a personal visual style.',
    image: portfolio,
    imageAlt: "RvL's Portfolio logo in white serif lettering on olive green",
    links: {
      code: 'https://github.com/ravellswdd/portofolio',
      codeLabel: 'GitHub',
      demo: 'https://youtu.be/5rIAhUPneX0',
    },
  },
]

/** The featured project: the big back wall in the 3D room and the carousel's first painting. */
export const FEATURED = Math.max(
  0,
  PROJECTS.findIndex((p) => p.featured),
)

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
/** "seven", for copy that counts the projects. */
export const PROJECT_COUNT = WORDS[PROJECTS.length] ?? String(PROJECTS.length)
