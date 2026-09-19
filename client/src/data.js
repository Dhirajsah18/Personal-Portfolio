// Central place to edit all portfolio content.

export const profile = {
  name: "Dhiraj Kumar Sah",
  shortName: "Dhiraj",
  tagline: "Building scalable full-stack products & high-performance web experiences.",
  roles: [
    "Full-Stack Developer",
    "MERN Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Node.js & Express Developer",
  ],
  bio: "I’m a Computer Science graduate and Full-Stack / MERN Developer focused on building secure, scalable, and user-focused applications. I work with React, Node.js, Express.js, MongoDB, and Python, and enjoy turning ideas into clean, reliable software.",
  email: "dhirajsah2003@gmail.com",
  phone: "+91 8240562624",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/Dhirajsah18",
    linkedin: "https://www.linkedin.com/in/dhirajsah18/",
    email: "mailto:dhirajsah2003@gmail.com",
  },
};

export const skills = [
  {
    category: "Frontend",
    tag: "frontend",
    items: ["React", "Vite", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Responsive UI"],
  },
  {
    category: "Backend & APIs",
    tag: "backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "FastAPI"],
  },
  {
    category: "Databases & Cloud",
    tag: "database",
    items: ["MongoDB", "MySQL", "SQL"],
  },
  {
    category: "Languages",
    tag: "languages",
    items: ["JavaScript", "C++", "Python", "SQL"],
  },
  {
    category: "Developer Tools",
    tag: "tools",
    items: ["Git", "GitHub", "VS Code", "Postman"],
  },
  {
    category: "Core Competencies",
    tag: "soft",
    items: ["Problem Solving", "Team Collaboration", "Time Management", "Adaptability"],
  },
];

export const projects = [
  {
    id: "vtube",
    title: "V-Tube — Video Sharing Platform",
    category: "fullstack",
    featured: true,
    description:
      "Full-stack video platform featuring JWT authentication, media uploads, custom playlists, comments, and real-time subscriptions.",
    highlights: ["10+ Secure Endpoints", "JWT Authentication", "Video Streaming Architecture"],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST APIs", "Tailwind CSS"],
    image: "vtube",
    github: "https://github.com/Dhirajsah18",
    link: "https://v-tube-iota.vercel.app",
  },
  {
    id: "creative-showcase",
    title: "Creative Showcase — Image Gallery",
    category: "fullstack",
    featured: true,
    description:
      "Creator image portfolio featuring cloud media uploads, tag-based discovery, and a responsive masonry layout.",
    highlights: ["Masonry Grid Layout", "Cloud Media Uploads", "User Dashboard"],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "Tailwind CSS"],
    image: "creative-showcase",
    github: "https://github.com/Dhirajsah18/Intern-Technical-Assessment/tree/main/Creative_Showcase",
    link: "https://intern-technical-assessment.vercel.app/",
  },
  {
    id: "video-summarizer",
    title: "Smart Video Summarizer",
    category: "ai",
    featured: true,
    description:
      "AI web app transcribing video audio into concise, actionable text summaries in minutes.",
    highlights: ["Audio-to-Text Pipeline", "AI Summarization", "FastAPI Integration"],
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "FastAPI", "REST APIs"],
    image: "video-summarizer",
    github: "https://github.com/Dhirajsah18",
    link: null,
  },
  {
    id: "todo-api",
    title: "Smart Task Management REST API",
    category: "backend",
    featured: false,
    description:
      "REST API backend with secure JWT authentication, CRUD workflows, and structured MongoDB data models.",
    highlights: ["8+ Secured Endpoints", "Centralized Validation", "JWT Authorization"],
    tech: ["Node.js", "Express.js", "MongoDB", "JWT Auth", "Postman"],
    image: null,
    github: "https://github.com/Dhirajsah18",
    link: null,
  },
];

export const education = [
  {
    year: "2022 – 2026",
    degree: "B.Tech in Computer Science & Engineering (AI & ML)",
    institution: "Brainware University",
    score: "CGPA: 8.9 / 10.0",
    badge: "First Class Distinction",
    coursework: ["Data Structures & Algorithms", "Artificial Intelligence & ML", "Database Management (DBMS)", "Operating Systems", "Computer Networks"],
  },
  {
    year: "2021",
    degree: "Senior Secondary Examination (Class XII - CBSE)",
    institution: "Kendriya Vidyalaya",
    score: "Percentage: 80%",
    badge: "Science Stream (PCM)",
    coursework: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  },
  {
    year: "2019",
    degree: "Secondary Examination (Class X - CBSE)",
    institution: "Kendriya Vidyalaya",
    score: "Percentage: 81%",
    badge: "General Academics",
    coursework: ["Mathematics", "Science", "Social Science", "English"],
  },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

