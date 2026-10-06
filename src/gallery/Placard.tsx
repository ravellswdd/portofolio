import type { Project } from '../data/types'

/** Wall placard for the painting in front of the visitor (carousel and 3D room share it). */
export function Placard({ project, onEnter }: { project: Project; onEnter: () => void }) {
  return (
    <>
      <h3 className="pl-title">{project.title}</h3>
      <p className="pl-muted">
        {project.role}, {project.type.toLowerCase()}
      </p>
      <p className="pl-muted">{project.when}</p>
      <p>{project.tools.join(' / ')}</p>
      <button type="button" className="pl-enter" onClick={onEnter}>
        Enter exhibit <span aria-hidden>&rarr;</span>
      </button>
    </>
  )
}
