import './Intro.css'

function Intro() {
    return (
        <div className="border">
            <div className="flexing-container">
                <div className="mb-view">
                    <div className="intro-container">
                        <h1 className='person'>Ravellino Suwandi</h1>
                        <span className='low-desc'>
                            An Undergraduate Student <br /> Binus University - Computer Science
                        </span>
                        <p className='desc'>
                           To me, technology goes beyond just components and hardware; it includes the passionate 
                           individuals who propel innovation forward. As an engaged university student and nonprofit 
                           staff member, I see technology as a powerful tool for making a positive difference. 
                           I am dedicated to broadening my knowledge, enhancing my creativity, and honing vital 
                           skills in communication, teamwork, and team management. At present, I am excited to 
                           contribute to meaningful projects, collaborating with like-minded individuals who share 
                           a commitment to impact and purpose.
                        </p>
                    </div>
                </div>
                <div className='profile-pic'>
                    <div className='pic-container'>
                        <img src="me-pic.JPG" alt="Ravellino Suwandi" className='pic-image'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro