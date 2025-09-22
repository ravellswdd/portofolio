import cateringz from '../assets/projects/cateringz.png'
import fittrack from '../assets/projects/FitTrack.png'
import tukangin from '../assets/projects/TukangIn.png'
import signscanner from '../assets/projects/Sign.png'
import portfolio from '../assets/projects/Portfolio.png'


export const EXPERIENCES = [
    { // CateringZ
        year: "Apr - Jun 2024",
        role: "Full Stack Web Developer",
        type: "Personal Assignment - CateringZ",
        tools: ['HTML','CSS','Javascript']
    },
    { // FitTrack
        year: "Oct - Dec 2024",
        role: "Machine Learning Engineer",
        type: "Group Assignment - FitTrack",
        tools: ['Python']
    },
    { // TukangIN
        year: "Feb - Jun 2025",
        role: "Database Engineer",
        type: "Group Assignment - TukangIN",
        tools: ['React','Typescript','CSS','PostgreSQL']
    },
    { // TrafficSign
        year: "Feb - Jun 2025",
        role: "Machine Learning Engineer Assistant",
        type: "Group Assignment - TrafficSign",
        tools: ['Python', 'React', 'Typescript','CSS']
    },
    { // Personal Project
        year: "Apr - Jun 2025",
        role: "Frontend Web Developer",
        type: "Personal Project",
        tools: ['React','Typescript','CSS']
    }
]

export const ORGANIZATION = [
    {
        role: "Vice Chairman of Student Council",
        org: "Ignatius Slamet Riyadi Highschool Karawang",
        year: "Jan 2024 - Jan 2025"
    },
    {
        role: "Activist of Art, Sport, and Internal Relations",
        org: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
        year: "Jan 2024 - Jan 2025"
    },
    {
        role: "Event Division Staff of One Million Help 2024",
        org: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
        year: "Feb 2024 - Jun 2024"
    },
    {
        role: "Logistic Division Coordinator of PMB X WP 2024",
        org: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
        year: "May 2024 - Sept 2024"
    },
    {
        role: "Staff of Art, Sport, and Internal Relations",
        org: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
        year: "Jan 2025 - Present"
    }
]

export const PROJECTS = [
    { // cateringz
        image: cateringz,
        title: "CateringZ - Website",
        link: "https://github.com/ravellswdd/cateringz",
        desc: "CateringZ is a web-based app for ordering healthy, nutritious meals. It offers a simple way to choose dishes and have them delivered directly to your home. The platform promotes balanced eating through convenient meal planning.",
        tools: ['HTML','CSS','Javascript']
    },
    { // fittrack
        image: fittrack,
        title: "FitTrack - CLI Based",
        link: "https://colab.research.google.com/drive/1VDyjW8DnE_2lMqwJ4qJt5ozyg-b77r6R?usp=sharing",
        desc: "FitTrack is an AI-powered app that recognizes food from images and displays its estimated calories per 100g. Designed for simplicity and ease of use, it helps users make healthier choices on the go. Ideal for those looking to track nutrition effortlessly.",
        tools: ['Python']
    },
    { // tukangin
        image: tukangin,
        title: "TukangIN - Website",
        link: "https://github.com/VincentiusJacob/TukangIN",
        desc: "TukangIN is a platform that connects users with verified and trusted household technicians. It covers various home services with transparent and reasonable pricing. The app ensures convenience, reliability, and quality service for everyday household needs.",
        tools: ['React','Typescript','CSS','PostgreSQL']
    },
    { // traffic sign
        image: signscanner,
        title: "SignScanner - Website",
        link: "https://github.com/VincentiusJacob/TrafficSignScanner",
        desc: "SignScanner is a web-based app that identifies traffic signs and provides their descriptions. It’s designed to assist tourists in understanding local road signs while traveling abroad. The app enhances safety and navigation in unfamiliar environments.",
        tools: ['Python', 'React', 'Typescript','CSS']
    },
    { // personal project
        image: portfolio,
        link: "https://github.com/ravellswdd/react-portofolio",
        title: "RvL Portfolio - Website",
        desc: "This portfolio project was created to strengthen my confidence in preparing for a professional career. It also serves as a platform to expand and apply my web development skills. Through this project, I explored new tools and refined my personal style.",
        tools: ['React','Typescript','CSS']
    }
]