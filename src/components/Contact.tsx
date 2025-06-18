import './Contact.css'
import { FaInstagramSquare, FaLinkedin } from 'react-icons/fa'

function Contact() {
    return (
        <div className="contact">
            <h2 className="contact-title">🙋🏻Where to Find Me!</h2>           
            <h1 className='quotes'>"Technology knows no bounds, but our time does. It is in the finite that we find meaning—so let us create with intention. Each invention, each line of code, each idea we bring to life is a reflection of our values and vision. Instead of chasing relentless progress, we should take a moment to reflect: are we creating with meaning? When we recognize the limits of our time, we begin to value the depth and intention behind what we build."</h1>
            <div className='contact-container'>
                <a href="https://www.linkedin.com/in/ravell-swnd" target="_blank" rel="noopener noreferrer"><FaLinkedin size={24}  />: Click Here for LinkedIn</a>
                <p>ravellinos7406@gmail.com</p>
                <p>+62 857-8076-7788</p>
                <a href="https://www.instagram.com/ravll_swd?utm_source=ig_web_button_share_sheet&igsh=MWx0bXBpY3Buc3J6dw==" target="_blank" rel="noopener noreferrer"><FaInstagramSquare size={24}/>: @ravll_swd</a>
            </div>
        </div>
    )
}

export default Contact