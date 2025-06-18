import { EXPERIENCES } from './index.ts'
import './Experience.css'
import { motion } from 'framer-motion'

function Experience() {
    return (
        <div className='exp'>
            <motion.h2
            initial = {{y: -50, opacity: 0}}
            whileInView={{y: 0, opacity: 1}}
            transition={{duration: 1, ease: 'linear'}}
            className='exp-title'>Experience</motion.h2>
            <div>
                {EXPERIENCES.map((experience, index) => (
                    <div key={index} className='exp-container'>
                        <motion.div
                        initial = {{x: -50, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 1, ease: 'linear'}}
                        className='year-container'>
                            <motion.p
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className='year'>{experience.year}</motion.p>
                        </motion.div>
                        <motion.div
                        initial = {{x: 50, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 1, ease: 'linear'}}
                        className='text-container'>
                            <p className='head-text'>{experience.role} - {experience.type}</p>
                            <p className='desc-text'>{experience.desc}</p>
                            <div className='tool-container'>
                                {experience.tools.map((lang, index) => (
                                <motion.p 
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                key={index} className='tools-text'>{lang}</motion.p>
                                ))}
                            </div>
                        </motion.div>
                    
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Experience