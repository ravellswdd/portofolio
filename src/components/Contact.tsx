import { motion } from 'framer-motion'
import './Contact.css'
import { FaInstagramSquare, FaLinkedin } from 'react-icons/fa'

function Contact() {
    return (
        <div id="contact" className="contact">
            <motion.h2 
            initial={{y:50, opacity: 0}}
            whileInView={{y:0, opacity: 1}}
            transition={{duration: 1.2, ease: 'easeIn'}}
            className="contact-title">🙋🏻Where to Find Me!</motion.h2>     
            <div className='quote-container'>
            <motion.h1
            initial={{y:50, opacity: 0}}
            whileInView={{y:0, opacity: 1}}
            transition={{duration: 1.2, ease: 'easeIn'}}
            >"Technology knows no bounds, 
                but our time does. It is in the finite 
                that we find meaning—so let us create with 
                intention. Each invention, each line of code, 
                each idea we bring to life is a reflection of 
                our values and vision. Instead of chasing relentless 
                progress, we should take a moment to reflect: are we 
                creating with meaning? When we recognize the limits 
                of our time, we begin to value the depth and intention 
                behind what we build."</motion.h1> 
            </div>      
            <div className='contact-container'>
                <a href="https://www.linkedin.com/in/ravell-swnd" target="_blank" rel="noopener noreferrer"><FaLinkedin size={24}  />: Click Here for LinkedIn</a>
                <p>ravell.swnd7@gmail.com</p>
                <p>+62 857-8076-7788</p>
                <a href="https://www.instagram.com/ravll_swd?utm_source=ig_web_button_share_sheet&igsh=MWx0bXBpY3Buc3J6dw==" target="_blank" rel="noopener noreferrer"><FaInstagramSquare size={24}/>: @ravll_swd</a>
            </div>
        </div>
    )
}

export default Contact