import { motion } from "framer-motion";
import './Modal.css'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
    img: string
    role: string
    lang: string[]
    type: string
    git: string
}


function Modal({ isOpen, onClose, title, type, description, img, role, lang,git}: ModalProps) {
    if (!isOpen) return null
    
    return (
    <div className="modal-overlay" onClick={onClose}>
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
        >  
            
        <div className="modal-header">
            <div className="img-container">
                <img className="img" src={img}/>
            </div>
            <div className="modal-text">
                <h3 className="modal-title">{title}</h3>
                <h3 className="modal-type">{type}</h3>
                <div className="view-demo">
                    <button 
                    onClick={() => window.open(git, "_blank")}
                    className="demo-btn">View Project</button>
                    <button
                    className="demo-btn">View Demo</button>
                </div>
            </div>
        </div>
        <p className="modal-desc">{description}</p>

        <div className="modal-ext">
            <div className="modal-container">
                <h4>Role</h4>
                <p className="modal-role">{role}</p>
            </div>
            <div className="modal-container">
                <h4>Programming Tools</h4>
                <div className="lang">
                    {lang.map((tool, i) => (
                        <p key={i} className="lang-item">{tool}</p>
                    ))}
                </div>
                
            </div>
        </div>
        <button onClick={onClose} className="modal-button">
        Close
        </button>
        </motion.div>
    </div>
    )
    
}
export default Modal