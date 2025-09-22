import { EXPERIENCES, ORGANIZATION } from "./index.ts"
import "./Experience.css"
import { motion } from "framer-motion"

function Experience() {
    return (
        <div id="Experience"className='exp-border'>
            <div className='exp-proj'>
                <motion.div 
                initial = {{x: -50, opacity: 0}}
                whileInView={{x:0, opacity: 1}}
                transition={{duration: 1, ease: 'linear'}}
                className='exp-box'>
                    <h2>Project Experience</h2>
                    {EXPERIENCES.map((exp, index) => (
                        <div key={index} className="exp-container">
                            <li className="role">{exp.role}</li>
                            <p className="type">{exp.type}</p>
                            <p className="year">{exp.year}</p>
                        </div>
                    ))}
                </motion.div>

                <motion.div 
                initial = {{x: 50, opacity: 0}}
                whileInView={{x:0, opacity: 1}}
                transition={{duration: 1, ease: 'linear'}}
                className='exp-box'>
                    <h2>Organization Experience</h2>
                    {ORGANIZATION.map((org, index) => (
                        <div key={index} className="exp-container">
                            <li className="role">{org.role}</li>
                            <p className="type">{org.org}</p>
                            <p className="year">{org.year}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
        
    )
}

export default Experience

{/* {EXPERIENCES.map((experience, index) => (
                            <div key={index} className='exp-container'>
                                <motion.div
                                initial = {{x: 50, opacity: 0}}
                                whileInView={{x: 0, opacity: 1}}
                                transition={{duration: 1, ease: 'linear'}}
                                className='year-container'>
                                    <motion.p
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                    className='year'>{experience.year}</motion.p>
                                    <div className='text-container'>
                                    <p className='head-text'>{experience.role} - {experience.type}</p>
                                    <div className='tool-container'>
                                        {experience.tools.map((lang, index) => (
                                        <motion.p 
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                        key={index} className='tools-text'>{lang}</motion.p>
                                        ))}
                                </div>

                                    </div>
                                </motion.div>
                            </div>
                        ))} */}