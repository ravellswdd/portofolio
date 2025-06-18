import { motion, type Variants } from 'framer-motion';
import './Technology.css'
import { RiReactjsLine } from "react-icons/ri";
import { RiHtml5Line } from "react-icons/ri";
import { RiCss3Line } from "react-icons/ri";
import { RiJavaFill } from "react-icons/ri";
import { RiJavascriptFill } from "react-icons/ri";

const iconVariants = (duration: number): Variants => ({
        initial: {y: -10},
        animate: {
            y: [10,-10],
            transition: {
                duration: duration,
                ease: 'linear',
                repeat: Infinity,
                repeatType: "reverse"
            }
        },
    })

function Technology() {
    return (
        <div className='tech-border'>
            <motion.h2
            initial={{y: -20, opacity: 0}}
            whileInView = {{y: 0, opacity: 1}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            className='tech-title'>Technologies</motion.h2>
            <div className='web-dev-container'>
                <motion.h3
                initial={{x: 100, opacity: 0}}
                whileInView = {{x: 0, opacity: 1}}
                transition={{duration: 0.8, ease: 'easeOut'}}
                className='web-title'>Web Developement</motion.h3>
                <motion.div
                initial={{x: 100, opacity: 0}}
                whileInView = {{x: 0, opacity: 1}}
                transition={{duration: 0.8, ease: 'easeOut'}}
                className='web-dev'>
                    <motion.div 
                    variants ={iconVariants(2.5)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <RiReactjsLine className='react-icon'/>
                    </motion.div>
                    <motion.div 
                    variants ={iconVariants(3)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <RiHtml5Line className='html-icon'/>
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(5)}
                    initial='initial'
                    animate='animate' 
                    className='border-icon'>
                        <RiCss3Line className='css-icon'/>
                    </motion.div>
                
                </motion.div>
            </div>

            <div className='prog-container'>
                <motion.h3
                initial={{x: -100, opacity: 0}}
                whileInView = {{x: 0, opacity: 1}}
                transition={{duration: 0.8, ease: 'easeOut'}}
                className='prog-title'>Programming Languages & Database</motion.h3>
                

            <motion.div 
            initial={{x: -100, opacity: 0}}
            whileInView = {{x: 0, opacity: 1}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            className='prog-db'>
                    <motion.div
                    variants ={iconVariants(2.5)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <RiJavaFill className='java-icon'/>
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(3)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                        alt="Python Logo"
                        width={72}
                        />
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(5)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                        alt="MySQL Logo"
                        width={72}
                        />
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(4)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <RiJavascriptFill className='javascript-icon'/>
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(6)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <img src="https://cdn.simpleicons.org/c/A8B9CC" alt="C Logo" width={72}/>
                    </motion.div>
                    <motion.div
                    variants ={iconVariants(3.5)}
                    initial='initial'
                    animate='animate'
                    className='border-icon'>
                        <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" className= 'ts-icon'alt='ts logo' width={72}/>
                    </motion.div>
                </motion.div>
            </div>

                
        </div>
    )
}

export default Technology