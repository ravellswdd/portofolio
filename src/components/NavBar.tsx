import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { FaSquareTwitter } from "react-icons/fa6"
import './NavBar.css'

function NavBar() {
  return (
    <nav className="nav-bar">
        <div className="image">
          <img src="RvL.png" alt="logo" className="image-pic"/>
        </div>
        <div className="icons">
          <FaLinkedin/>
          <FaGithub/>
          <FaInstagram/>
          <FaSquareTwitter/>
        </div>
    </nav>
  )
}

export default NavBar