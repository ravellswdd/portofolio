import './Intro.css'

function Intro() {
    return (
        <div className="border">
            <div className="flexing-container">
                <div className="mb-view">
                    <div className="intro-container">
                        <h1 className='person'>Ravellino Suwandi</h1>
                        <span className='low-desc'>
                            An Undergraduate Computer Science Student <br /> Binus University - Intelligent Systems
                        </span>
                        <p className='desc'>
                           I am an undergraduate Computer Science student driven by a strong 
                           passion for learning and exploring the world of coding. 
                           With over two years of academic and hands-on experience, 
                           I have developed proficiency in various programming languages and 
                           technologies, including C, Python, Java, HTML, CSS, React, and MySQL. 
                           My goal is to apply my skills and knowledge to create meaningful solutions
                           and products that bring real value to society.
                        </p>
                    </div>
                </div>
                <div className='profile-pic'>
                    <div className='pic-container'>
                        <img src="max.jpg" alt="Ravellino Suwandi" className='pic-image'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro