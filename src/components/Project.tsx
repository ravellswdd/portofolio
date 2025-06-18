import './Project.css'
import { PROJECTS } from '.' 

function Project() {
    return (
        <div className="projects">
            <h2 className="proj-title">Projects</h2>
            <div>
                {PROJECTS.map((project, index) => (
                    <div key={index} className='proj-container'>
                        <div className='image-container'>
                            <img className='image' src={project.image} alt="proj images" />
                        </div> 
                        <div className='box-container'>
                            <p className='title-text'>{project.title}</p>
                            <p className='desc'>{project.desc}</p>
                            <div className='tools-container'>
                                {project.tools.map((item, index) => (
                                <p key={index} className='tools'>{item}</p>
                                ))}
                            </div>
                        </div>
                    
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Project