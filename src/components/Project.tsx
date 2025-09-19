import './Project.css'
import { PROJECTS } from '.' 
import { motion } from 'framer-motion'

function Project() {
    return (
        <div id="Projects" className="projects">
            <motion.h2
            initial={{ y: -50, opacity: 0 }}
            whileInView={{y: 0, opacity: 1}}
            transition = {{duration: 1}}
            className="proj-title">Projects</motion.h2>
            <div>
                {PROJECTS.map((project, index) => (
                    <div key={index} className='proj-container'>
                        <motion.div
                        initial={{x: -100, opacity: 0}}
                        whileInView={{ x: 0, opacity: 1}}
                        transition={{ duration: 2.4}}
                        className='image-container'>
                            <img className='image' src={project.image} alt="proj images" />
                        </motion.div> 
                        <motion.div
                        initial = {{x: 50, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 2.4, ease: 'linear'}}
                        className='box-container'>
                            <a className='title-text' href={project.link} target="_blank" rel="noopener noreferrer">{project.title}</a>
                            <p className='desc'>{project.desc}</p>
                            <div className='tools-container'>
                                {project.tools.map((item, index) => (
                                <motion.p
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                key={index} className='tools'>{item}</motion.p>
                                ))}
                            </div>
                        </motion.div>
                    
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Project