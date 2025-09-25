import './Project.css'
import { PROJECTS } from '.'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Modal from './Modal'

function Project() {
    const [open, setOpen] = useState(false)
    const [selectedProj, setSelectedProj] = useState<any>(null)

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
      return () => {
        document.body.style.overflow = "auto"
      }
    }, [open])

    return (
        <div id="Projects" className="proj-border">
            <motion.h2 
              initial={{y: -50, opacity: 0}}
              whileInView={{y:0, opacity: 1}}
              transition={{duration: 1, ease: 'linear'}}
              className='title'
            >
              Projects
            </motion.h2>

            <motion.div 
            initial = {{x: -200, opacity: 0}}
            whileInView={{x:0, opacity: 1}}
            transition={{duration: 0.5, ease: 'linear'}}
            className="swiper-container">
                <div className="swiper-inner">
                    {PROJECTS.map((proj, index) => (
                        <motion.div 
                          whileHover={{scale: 1.05}}
                          transition={{duration: 0.5, ease: "easeOut"}}
                          className="swiper-box" 
                          key={index}
                        >
                            <img className="proj-img" src={proj.image} alt={proj.title} />
                            <div className="proj-desc">
                                <p className="proj-title">{proj.title}</p>
                                <div className="lang-container">
                                    {proj.tools.map((lang, i) => (
                                        <p key={i}>{lang}</p>
                                    ))}
                                </div>
                                <button 
                                onClick={() => {
                                setSelectedProj(proj)
                                setOpen(true)
                                }}
                                className="button">View More</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <Modal 
              isOpen={open}
              onClose={() => setOpen(false)}
              title={selectedProj?.title || ""}
              description={selectedProj?.desc || ""}
              img={selectedProj?.image || ""}
              role={selectedProj?.role || ""}
              lang={selectedProj?.tools || ""}
              type={selectedProj?.type || ""}
              git={selectedProj?.git || ""}
              yt={selectedProj?.yt || ""}
            />
        </div>
    )
}

export default Project
