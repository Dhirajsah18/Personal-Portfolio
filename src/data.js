// Central place to edit all portfolio content.

export const profile = {
  name: "Dhiraj Kumar Sah",
  roles: [
    "Full-Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Backend Developer",
    "Node.js Developer",
  ],
  bio: "Computer Science undergraduate who builds secure, scalable, and data-driven web applications. Hands-on experience designing REST APIs, JWT-based authentication systems, and full-stack products with React, Node.js, and MongoDB — from database schema to pixel-tuned UI.",
  location: "Kolkata / West Bengal, India",
  email: "dhirajsah2003@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/Dhirajsah18",
    linkedin: "https://www.linkedin.com/in/dhirajsah18/",
    email: "mailto:dhirajsah2003@gmail.com",
  },
};

export const skills = [
  { category: "Languages", items: ["JavaScript", "C++", "Python", "HTML5", "CSS3", "SQL"] },
  { category: "Frontend", items: ["React", "Vite", "Tailwind CSS", "Responsive UI"] },
  { category: "Backend", items: ["Node.js", "Express.js", "REST APIs", "JWT Auth"] },
  { category: "Databases", items: ["MongoDB", "MySQL"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
  { category: "Soft Skills", items: ["Problem Solving", "Team Collaboration", "Time Management"] },
];

export const projects = [
  {
    title: "V-Tube — Video Sharing Platform",
    description:
      "A scalable full-stack video sharing platform with user authentication and role-based access. JWT-based auth secures 10+ backend API endpoints for uploads, likes, comments, playlists, and subscriptions.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST APIs"],
    image: "vtube",
    github: "https://github.com/Dhirajsah18",
    link: "https://v-tube-iota.vercel.app",
  },
  {
    title: "Creative Showcase — Image Gallery Platform",
    description:
      "A secure image gallery platform enabling user-specific media uploads and personalized dashboards, with a responsive masonry-layout frontend and access-controlled backend APIs.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth"],
    image: "creative-showcase",
    github: "https://github.com/Dhirajsah18/Intern-Technical-Assessment/tree/main/Creative_Showcase",
    link: "https://intern-technical-assessment.vercel.app/",
  },
  {
    title: "Smart Video Summarizer",
    description:
      "A full-stack web app that turns long videos into concise, readable summaries — a React frontend calls a Node/FastAPI backend that transcribes audio and generates a short text summary, cutting hours of footage into a two-minute read.",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "FastAPI", "REST APIs"],
    image: "video-summarizer",
    github: "https://github.com/Dhirajsah18",
    link: null,
  },
  {
    title: "Smart TODO API — Task Management Backend",
    description:
      "A RESTful task-management backend supporting full CRUD for authenticated users. 8+ endpoints secured with JWT authentication, plus centralized validation and error handling for consistent responses.",
    tech: ["Node.js", "Express.js", "MongoDB", "JWT Auth"],
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
    details: "CGPA: 8.9",
  },
  {
    year: "2021",
    degree: "Senior Secondary Examination (CBSE)",
    institution: "Kendriya Vidyalaya",
    details: "Percentage: 80%",
  },
  {
    year: "2019",
    degree: "Secondary Examination (CBSE)",
    institution: "Kendriya Vidyalaya",
    details: "Percentage: 81%",
  },
];

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
