import bcrypt from "bcryptjs";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Admin from "../models/Admin.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "./localStore.js";

const initialSkills = [
  {
    category: "Frontend",
    tag: "frontend",
    items: ["React", "Vite", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Responsive UI"],
    order: 1,
  },
  {
    category: "Backend & APIs",
    tag: "backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "FastAPI"],
    order: 2,
  },
  {
    category: "Databases & Cloud",
    tag: "database",
    items: ["MongoDB", "MySQL", "SQL"],
    order: 3,
  },
  {
    category: "Languages",
    tag: "languages",
    items: ["JavaScript", "C++", "Python", "SQL"],
    order: 4,
  },
  {
    category: "Developer Tools",
    tag: "tools",
    items: ["Git", "GitHub", "VS Code", "Postman"],
    order: 5,
  },
  {
    category: "Core Competencies",
    tag: "soft",
    items: ["Problem Solving", "Team Collaboration", "Time Management", "Adaptability"],
    order: 6,
  },
];

const initialProjects = [
  {
    slug: "vtube",
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
    slug: "creative-showcase",
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
    slug: "video-summarizer",
    title: "Smart Video Summarizer",
    category: "ai",
    featured: true,
    description:
      "AI web app transcribing video audio into concise, actionable text summaries in minutes.",
    highlights: ["Audio-to-Text Pipeline", "AI Summarization", "FastAPI Integration"],
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "FastAPI", "REST APIs"],
    image: "video-summarizer",
    github: "https://github.com/Dhirajsah18",
    link: "",
  },
  {
    slug: "todo-api",
    title: "Smart Task Management REST API",
    category: "backend",
    featured: false,
    description:
      "REST API backend with secure JWT authentication, CRUD workflows, and structured MongoDB data models.",
    highlights: ["8+ Secured Endpoints", "Centralized Validation", "JWT Authorization"],
    tech: ["Node.js", "Express.js", "MongoDB", "JWT Auth", "Postman"],
    image: "",
    github: "https://github.com/Dhirajsah18",
    link: "",
  },
];

export const seedInitialData = async () => {
  const { isMongoConnected } = getDbStatus();
  const adminEmail = process.env.ADMIN_EMAIL || "dhirajsah2003@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (isMongoConnected) {
    try {
      // 1. Seed Admin
      const existingAdmin = await Admin.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await Admin.create({
          email: adminEmail,
          password: hashedPassword,
          name: "Dhiraj Kumar Sah",
          role: "admin",
        });
        console.log(`👤 Initial Admin created in MongoDB: ${adminEmail}`);
      }

      // 2. Seed Projects
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.insertMany(initialProjects);
        console.log(`🚀 Initial Projects seeded in MongoDB (${initialProjects.length} items)`);
      }

      // 3. Seed Skills
      const skillCount = await Skill.countDocuments();
      if (skillCount === 0) {
        await Skill.insertMany(initialSkills);
        console.log(`⚡ Initial Skills seeded in MongoDB (${initialSkills.length} categories)`);
      }
    } catch (err) {
      console.error("Error during MongoDB seeding:", err.message);
    }
  } else {
    // Seed Local File Store
    const store = readStore();
    let updated = false;

    // Seed Admin
    if (!store.admins || store.admins.length === 0) {
      store.admins = [
        {
          _id: generateId(),
          email: adminEmail,
          password: hashedPassword,
          name: "Dhiraj Kumar Sah",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ];
      updated = true;
      console.log(`👤 Initial Admin created in Local Store: ${adminEmail}`);
    }

    // Seed Projects
    if (!store.projects || store.projects.length === 0) {
      store.projects = initialProjects.map((p) => ({
        ...p,
        _id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      updated = true;
      console.log(`🚀 Initial Projects seeded in Local Store (${store.projects.length} items)`);
    }

    // Seed Skills
    if (!store.skills || store.skills.length === 0) {
      store.skills = initialSkills.map((s) => ({
        ...s,
        _id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      updated = true;
      console.log(`⚡ Initial Skills seeded in Local Store (${store.skills.length} categories)`);
    }

    if (updated) {
      writeStore(store);
    }
  }
};
