import { EXPERIENCES } from './index.ts'

import './Experience.css'

function Experience() {
    return (
        <div className='exp'>
            <h2 className='exp-title'>Experience</h2>
            <div>
                {EXPERIENCES.map((experience, index) => (
                    <div key={index} className='exp-container'>
                        <div className='year-container'>
                            <p className='year'>{experience.year}</p>
                        </div>
                        <div className='text-container'>
                            <p className='head-text'>{experience.role} - {experience.type}</p>
                            <p className='desc-text'>{experience.desc}</p>
                            <div className='tool-container'>
                                {experience.tools.map((lang, index) => (
                                <p key={index} className='tools-text'>{lang}</p>
                                ))}
                            </div>
                        </div>
                    
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Experience