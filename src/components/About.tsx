import { motion } from 'framer-motion'
import './About.css'

function About() {
    return (
        <div id="About" className='title-border'>
            <motion.h2 
            initial = {{ y: -100, opacity: 0}}
            whileInView = {{ y: -20, opacity: 1}}
            transition={{ duration: 1,ease: 'easeOut'}}
            className='title'>About Me</motion.h2>
            <div className='image-flex'>
                <div className='image-container'>
                    <motion.img 
                    initial = {{ x: -100, opacity: 0}}
                    whileInView = {{ x: 0, opacity: 1}}
                    transition={{ duration: 1, ease: 'circOut'}}
                    className='png' src="intro.JPG" alt="about-pic" />
                </div>
                <motion.div 
                    initial = {{ x: 100, opacity: 0}}
                    whileInView = {{ x: 0, opacity: 1}}
                    transition={{ duration: 1, ease: 'circOut'}}className='desc-container'>
                    <div className='fyi'>
                        <motion.div 
                        whileHover={{scale: 1.05}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='fyi-box'>
                            <p className='fyi-head'>3+</p>
                            <p className='fyi-desc'>Experience<br />in Coding</p>
                        </motion.div>
                        <motion.div 
                        whileHover={{scale: 1.05}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='fyi-box'>
                            <p className='fyi-head'>5+</p>
                            <p className='fyi-desc'>Programming<br />Language</p>
                        </motion.div>
                        <motion.div
                        whileHover={{scale: 1.05}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='fyi-box'>
                            <p className='fyi-head'>10+</p>
                            <p className='fyi-desc'>AI Models<br />Trained</p>
                        </motion.div>
                    </div>
                    <div className='desc-about'>
                        <p
                        >I am an undergraduate Computer Science student at BINUS University, 
                        passionate about coding, intelligent systems, and technology. With over 
                        two years of academic and hands-on experience, I have gained proficiency 
                        in C, Python, Java, HTML, CSS, React, and MySQL. Beyond academics, I actively 
                        engage in nonprofit campus organizations, where I develop skills in teamwork, 
                        communication, and project management. I strive to create meaningful solutions 
                        that bring real value to society while continuously learning and growing with purpose.</    p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default About