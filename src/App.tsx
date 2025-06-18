import NavBar from './components/NavBar.tsx'
import Intro from './components/Intro.tsx'
import About  from './components/About.tsx'
import './App.css'
import Technology from './components/Technology.tsx'
import Experience from './components/Experience.tsx'
import Project from './components/Project.tsx'
import Contact from './components/Contact.tsx'

function App() {
  return (
    <div className='wrap'>
      <div className='overlay'>
        <div className="background"></div>
      </div>
      
      <div className='content'>
          <NavBar/>
          <Intro/>
          <About/>
          <Technology/>
          <Experience/>
          <Project/>
          <Contact/>
        </div>
    </div>
  )
}

export default App
