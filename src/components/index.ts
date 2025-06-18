import cateringz from '../assets/projects/cateringz.png'
import fittrack from '../assets/projects/FitTrack.png'
import tukangin from '../assets/projects/TukangIn.png'
import signscanner from '../assets/projects/Sign.png'
import portfolio from '../assets/projects/Portfolio.png'


export const EXPERIENCES = [
    { // CateringZ
        year: "Apr - Jun 2024",
        role: "Full Stack Web Developer",
        type: "Personal Assignment",
        desc: 'CateringZ was my first individual project from campus, sparking my interest in website development despite my limited knowledge. I learned HTML and CSS to turn my Figma design into a functional site, creating five linked pages and implementing a backend for email registration using JavaScript. The project was challenging due to scheduling issues and my initial lack of web development expertise, which caused delays. However, through consistency and discipline in meeting deadlines, I reorganized my schedule to enhance my progress in building the website.',
        tools: ['HTML','CSS','Javascript']
    },
    { // FitTrack
        year: "Oct - Dec 2024",
        role: "Machine Learning Engineer",
        type: "Group Assignment",
        desc: 'FitTrack inspired me to pursue Intelligent System streaming due to my struggles with junk food and exercise. I proposed an AI model to predict food images and their calorie counts per 100g, catering to those wanting to eat healthily. I researched datasets, preprocessed data, and used a pre-trained model while my teammates worked on user experience for image input. I faced minor challenges as I was new to AI model creation, struggling with unfamiliar code structures. To address this, I used YouTube and AI tools to learn necessary coding syntax and concepts.',
        tools: ['Python Programming']
    },
    { // TukangIN
        year: "Feb - Jun 2025",
        role: "Database Engineer",
        type: "Group Assignment",
        desc: 'TukangIN connects consumers with reliable technicians for household needs, addressing the challenge of finding trustworthy electronic technicians. I contributed by creating and maintaining the database and UML diagrams. Despite a well-designed web application, we encountered UI optimization issues, miscommunication, and misdirected respondents, which delayed progress. To resolve these, we conducted evaluations, retargeted respondents, improved communication clarity, and reorganized our development schedule for collaborative UI optimization.',
        tools: ['React','Typescript','CSS','PostgreSQL']
    },
    { // TrafficSign
        year: "Feb - Jun 2025",
        role: "Machine Learning Engineer Assistant",
        type: "Group Assignment",
        desc: "Whenever I travel to another country, I always pay attention to the road signs I pass. I often wonder if tourists might need quick access to this information. With that in mind, I proposed to my teammates the idea of developing an AI model for traffic sign detection. I played a role in fine-tuning the model’s architecture and examining trial errors to understand what was happening. Eventually, we successfully built and completed the project. I encountered some challenges while trying to resolve an error related to the model's test accuracy, but I was able to identify the issue and sent a revision to my teammate for further updates.",
        tools: ['Python Programming', 'React', 'Typescript','CSS']
    },
    { // Personal Project
        year: "Apr - Jun 2025",
        role: "Frontend Web Developer",
        type: "Personal Project",
        desc: 'In semester 4, I recognized the importance of a portfolio in attracting attention to my work, prompting me to create a web-based portfolio using React, TypeScript, and CSS. This project served not only as a personal endeavor but also as a learning platform for new technologies. Despite facing challenges, such as limited creativity due to my learning stage, I used existing web portfolios as references while striving to differentiate mine with unique backgrounds and component positioning to build my confidence in a rapidly evolving tech landscape.',
        tools: ['React','Typescript','CSS']
    }
]

export const PROJECTS = [
    { // cateringz
        image: cateringz,
        title: "CateringZ - Website",
        desc: "CateringZ is a web-based app for ordering healthy, nutritious meals. It offers a simple way to choose dishes and have them delivered directly to your home. The platform promotes balanced eating through convenient meal planning.",
        tools: ['HTML','CSS','Javascript']
    },
    { // fittrack
        image: fittrack,
        title: "FitTrack - CLI Based",
        desc: "FitTrack is an AI-powered app that recognizes food from images and displays its estimated calories per 100g. Designed for simplicity and ease of use, it helps users make healthier choices on the go. Ideal for those looking to track nutrition effortlessly.",
        tools: ['Python Programming']
    },
    { // tukangin
        image: tukangin,
        title: "TukangIN - Website",
        desc: "TukangIN is a platform that connects users with verified and trusted household technicians. It covers various home services with transparent and reasonable pricing. The app ensures convenience, reliability, and quality service for everyday household needs.",
        tools: ['React','Typescript','CSS','PostgreSQL']
    },
    { // traffic sign
        image: signscanner,
        title: "SignScanner - Website",
        desc: "SignScanner is a web-based app that identifies traffic signs and provides their descriptions. It’s designed to assist tourists in understanding local road signs while traveling abroad. The app enhances safety and navigation in unfamiliar environments.",
        tools: ['Python Programming', 'React', 'Typescript','CSS']
    },
    { // personal project
        image: portfolio,
        title: "RvL Portfolio - Website",
        desc: "This portfolio project was created to strengthen my confidence in preparing for a professional career. It also serves as a platform to expand and apply my web development skills. Through this project, I explored new tools and refined my personal style.",
        tools: ['React','Typescript','CSS']
    }
]