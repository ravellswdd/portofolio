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
                    className='png' src="aboutt.jpg" alt="about-pic" />
                </div>
                <div className='desc-container'>
                    <div className='desc-about'>
                        <motion.p
                        initial = {{ x: 100, opacity: 0}}
                        whileInView = {{ x: 0, opacity: 1}}
                        transition={{ duration: 1, ease: 'circOut'}}
                        >I am an undergraduate Computer Science student driven by a strong 
                        passion for learning and exploring the world of coding. 
                        With over two years of academic and hands-on experience, 
                        I have developed proficiency in various programming languages and 
                        technologies, including C, Python, Java, HTML, CSS, React, and MySQL. 
                        My goal is to apply my skills and knowledge to create meaningful solutions
                        and products that bring real value to society.</motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About