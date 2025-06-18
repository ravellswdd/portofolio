import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import './NavBar.css'

function NavBar() {
  return (
    <nav className="nav-bar">
        <div className="image">
          <img src="RvL.png" alt="logo" className="image-pic"/>
        </div>
        <div className="icons">
          <a href="https://www.linkedin.com/in/ravell-swnd" target="_blank" rel="noopener noreferrer"><FaLinkedin/></a>
          <a href="https://github.com/ravellswdd" target="_blank" rel="noopener noreferrer"><FaGithub/></a>

          <a href="https://www.instagram.com/ravll_swd?utm_source=ig_web_button_share_sheet&igsh=MWx0bXBpY3Buc3J6dw==" target="_blank" rel="noopener noreferrer"><FaInstagram/></a>
        </div>
    </nav>
  )
}

export default NavBar