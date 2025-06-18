import './Technology.css'
import { RiReactjsLine } from "react-icons/ri";
import { RiHtml5Line } from "react-icons/ri";
import { RiCss3Line } from "react-icons/ri";
import { RiJavaFill } from "react-icons/ri";
import { RiJavascriptFill } from "react-icons/ri";


function Technology() {
    return (
        <div className='tech-border'>
            <h2 className='tech-title'>Technologies</h2>
            <div className='web-dev-container'>
                <h3 className='web-title'>Web Developement</h3>
                <div className='web-dev'>
                    <div className='border-icon'>
                        <RiReactjsLine className='react-icon'/>
                    </div>
                    <div className='border-icon'>
                        <RiHtml5Line className='html-icon'/>
                    </div>
                    <div className='border-icon'>
                        <RiCss3Line className='css-icon'/>
                    </div>
                </div>
            </div>

            <div className='prog-container'>
                <h3 className='prog-title'>Programming Languages & Database</h3>
                <div className='prog-db'>
                    <div className='border-icon'>
                        <RiJavaFill className='java-icon'/>
                    </div>
                    <div className='border-icon'>
                        <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                        alt="Python Logo"
                        width={72}
                        />
                    </div>
                    <div className='border-icon'>
                        <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                        alt="MySQL Logo"
                        width={72}
                        />
                    </div>
                    <div className='border-icon'>
                        <RiJavascriptFill className='javascript-icon'/>
                    </div>
                    <div className='border-icon'>
                        <img src="https://cdn.simpleicons.org/c/A8B9CC" alt="C Logo" width={72}/>
                    </div>
                    <div className='border-icon'>
                        <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" className= 'ts-icon'alt='ts logo' width={72}/>
                    </div>
                </div>
            </div>

                
        </div>
    )
}

export default Technology