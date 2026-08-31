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
  bio: "Computer Science undergraduate with expertise in building secure, highly scalable, and data-driven web applications. Passionate about crafting pixel-perfect interfaces, robust REST APIs, and JWT-authenticated backends with React, Node.js, and MongoDB.",
  location: "Kolkata, West Bengal, India",
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
    badge: "Full-Stack MERN",
    description:
      "A scalable video streaming & sharing platform with JWT-authenticated backend. Engineered 10+ REST API endpoints handling video uploads, likes, dynamic comment threads, user playlists, and real-time subscriptions.",
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
    badge: "Interactive Media",
    description:
      "A responsive image portfolio platform enabling user-specific media uploads, tag-based discovery, and personalized creator dashboards with a masonry layout and access-controlled backend APIs.",
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
    badge: "AI & Transcription",
    description:
      "An intelligent AI-powered application that transcribes video audio into structured, concise text summaries. Cuts hour-long videos into quick 2-minute actionable takeaways with high transcription accuracy.",
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
    badge: "Backend & Auth",
    description:
      "A high-performance task management backend built with Node.js and Express. Features 8+ secure endpoints, centralized validation middlewares, and custom error handling pipelines with MongoDB.",
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

