
import './NavBar.css'

function NavBar() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav-bar">
        <div className="image">
          <img src="RvL.png" alt="logo" className="image-pic"/>
        </div>
        <div className="icons">
          <p onClick={() => scrollToSection("About")}>About</p>
          <p onClick={() => scrollToSection("Technology")}>Technologies</p>
          <p onClick={() => scrollToSection("Experience")}>Experience</p>
          <p onClick={() => scrollToSection("Projects")}>Projects</p>
          <p onClick={() => scrollToSection("contact")}>Contact Me!</p>
        </div>
    </nav>
  )
}

export default NavBar