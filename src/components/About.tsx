import './About.css'

function About() {
    return (
        <div className='title-border'>
            <h2 className='title'>About Me</h2>
            <div className='image-flex'>
                <div className='image-width'>
                    <div className='image-container'>
                        <img className='png' src="about.JPG" alt="about-pic" />
                    </div>
                </div>
                <div className='desc-container'>
                    <div className='desc-about'>
                        <p>I am an undergraduate Computer Science student driven by a strong 
                        passion for learning and exploring the world of coding. 
                        With over two years of academic and hands-on experience, 
                        I have developed proficiency in various programming languages and 
                        technologies, including C, Python, Java, HTML, CSS, React, and MySQL. 
                        My goal is to apply my skills and knowledge to create meaningful solutions
                        and products that bring real value to society.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About