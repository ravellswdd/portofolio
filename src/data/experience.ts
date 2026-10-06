import type { ExperienceRow } from './types'

// Newest first within each track. Room 2 shows the tracks as two groups: technical (IT) first,
// then non-technical (organisation and event roles).
export const EXPERIENCE: ExperienceRow[] = [
  {
    track: 'tech',
    title: 'Full Stack Developer',
    org: 'BagiBagi, personal project',
    description:
      'Designed and built a bill-splitting web app: receipt reading, item-by-item splits and live group balances.',
    when: '2026',
  },
  {
    track: 'tech',
    title: 'Python Engineer Intern',
    org: 'Internship',
    description: 'Built and maintained the between modules of a Tryton-based ERP in Python.',
    when: '2026 - Present',
  },
  {
    track: 'tech',
    title: 'Machine Learning Engineer',
    org: 'People Counting, coursework project',
    description: 'Helped build and tune a YOLOv8n-based CNN that detects and counts people from a webcam or a photo.',
    when: '2025',
  },
  {
    track: 'tech',
    title: 'Database Engineer',
    org: 'TukangIN, group project',
    description: 'Database work in PostgreSQL for a platform that connects people with household technicians.',
    when: 'Feb - Jun 2025',
  },
  {
    track: 'tech',
    title: 'ML Engineer Assistant',
    org: 'SignScanner, group project',
    description: 'Helped train a traffic sign recognition model behind a React web app.',
    when: 'Feb - Jun 2025',
  },
  {
    track: 'tech',
    title: 'Frontend Developer',
    org: 'RvL Portfolio, personal project',
    description: 'Designed and built the first version of this portfolio in React and TypeScript.',
    when: 'Apr - Jun 2025',
  },
  {
    track: 'tech',
    title: 'Machine Learning Engineer',
    org: 'FitTrack, group project',
    description: 'Trained a food recognition model that estimates calories per 100 g from a photo.',
    when: 'Oct - Dec 2024',
  },
  {
    track: 'tech',
    title: 'Full Stack Developer',
    org: 'CateringZ, personal project',
    description: 'Built a healthy meal ordering site in HTML, CSS and JavaScript.',
    when: 'Apr - Jun 2024',
  },
  {
    track: 'nontech',
    title: 'Logistics Coordinator',
    org: 'KMB Dhammavaddhana, PMB X WP 2024',
    description: 'Coordinated the logistics division for the campus event.',
    when: 'May - Sep 2024',
  },
  {
    track: 'nontech',
    title: 'Vice Chairman',
    org: 'Student Council, Ignatius Slamet Riyadi High School',
    description: 'Helped lead the student council for a school year.',
    when: 'Jan 2022 - Jan 2023',
  },
]

export const EXPERIENCE_GROUPS = [
  { track: 'tech', label: 'Technical', note: 'IT' },
  { track: 'nontech', label: 'Non-technical', note: 'Organisations and events' },
] as const
