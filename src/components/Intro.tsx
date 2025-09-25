import { motion } from 'framer-motion'
import './Intro.css'

function Intro() {
    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="border">
            <div className="flexing-container">
                <div className="intro-container">
                    <motion.h1 
                    initial={{ x: -80, opacity: 0}} 
                    animate={{ x: 0, opacity: 1}}
                    transition={{ duration: 0.7}}
                    className='person'>Ravellino Suwandi</motion.h1>
                    <motion.span 
                    initial={{ x: -100, opacity: 0}} 
                    animate={{ x: 0, opacity: 1}}
                    transition={{ duration: 0.7, delay: 0.3}}
                    className='low-desc'>
                        A Computer Science Undergraduate | BINUS University
                    </motion.span>
                    <motion.span 
                    initial={{ x: -100, opacity: 0}} 
                    animate={{ x: 0, opacity: 1}}
                    transition={{ duration: 0.7, delay: 0.3}}
                    className='low-desc'>
                        Streaming: Intelligent Systems
                    </motion.span>
                    <motion.p 
                    initial={{ x: -100, opacity: 0}} 
                    animate={{ x: 0, opacity: 1}}
                    transition={{ duration: 0.7, delay: 0.5}}
                    className='desc'>
                        To me, technology goes beyond just components and hardware; it includes the passionate 
                        individuals who propel innovation forward. As an engaged university student and nonprofit 
                        staff member, I see technology as a powerful tool for making a positive difference. 
                        I am dedicated to broadening my knowledge, enhancing my creativity, and honing vital 
                        skills in communication, teamwork, and team management. At present, I am excited to 
                        contribute to meaningful projects, collaborating with like-minded individuals who share 
                        a commitment to impact and purpose.
                    </motion.p>
                    
                    <motion.div
                        initial={{ x: -100, opacity: 0}} 
                        animate={{ x: 0, opacity: 1}}
                        transition={{ duration: 0.7, delay: 0.5}}
                    className='cv-git-btn'>
                        <motion.button
                        whileHover={{scale: 1.1}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='btn'
                        onClick={() => scrollToSection("Projects")}
                        >View My Projects</motion.button>
                        <motion.button
                        whileHover={{scale: 1.1}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='btn'
                        onClick={() => window.open("https://github.com/ravellswdd", "_blank")}
                        >View My Github</motion.button>
                        <motion.button
                        whileHover={{scale: 1.1}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        className='btn'
                        onClick={() => window.open("https://drive.google.com/file/d/1u87Io60ToDB9KmkbkTbAaSZxoAreWLhm/view?usp=sharing", "_blank")}
                        >Download CV</motion.button>
                    </motion.div>

                </div>
                <div className='profile-pic'>
                    <div className='pic-container'>
                        <motion.img
                        initial={{ x: 100, opacity: 0}} 
                        transition={{ duration: 0.7, delay: 0.8}}
                        animate={{ x: 0, opacity: 1}}
                        src="aboutt.jpg" alt="Ravellino Suwandi" className='pic-image'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro