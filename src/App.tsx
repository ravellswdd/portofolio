import NavBar from './components/NavBar.tsx'
import Intro from './components/Intro.tsx'
import About  from './components/About.tsx'
import './App.css'

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
        </div>
    </div>
  )
}

export default App
