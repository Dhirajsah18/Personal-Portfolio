
import {
  SiJavascript,
  SiCplusplus,
  SiPython,
  SiHtml5,
  SiCss,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiGit,
  SiGithub,
  SiPostman,
  SiFastapi,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  FiDatabase,
  FiGlobe,
  FiSmartphone,
  FiTarget,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiCode,
} from "react-icons/fi";

export const skillMeta = {
  JavaScript: { icon: SiJavascript, color: "#f7df1e" },
  "C++": { icon: SiCplusplus, color: "#00599c" },
  Python: { icon: SiPython, color: "#38bdf8" },
  HTML5: { icon: SiHtml5, color: "#e34f26" },
  CSS3: { icon: SiCss, color: "#1572b6" },
  SQL: { icon: FiDatabase, color: "#0284c7" },
  React: { icon: SiReact, color: "#00d8ff" },
  Vite: { icon: SiVite, color: "#a855f7" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38bdf8" },
  "Responsive UI": { icon: FiSmartphone, color: "#10b981" },
  "Node.js": { icon: SiNodedotjs, color: "#22c55e" },
  "Express.js": { icon: SiExpress, color: "#f8fafc" },
  FastAPI: { icon: SiFastapi, color: "#059669" },
  "REST APIs": { icon: FiGlobe, color: "#00d2ff" },
  "JWT Auth": { icon: SiJsonwebtokens, color: "#ec4899" },
  MongoDB: { icon: SiMongodb, color: "#10b981" },
  MySQL: { icon: SiMysql, color: "#0284c7" },
  Git: { icon: SiGit, color: "#f05032" },
  GitHub: { icon: SiGithub, color: "#e2e8f0" },
  "VS Code": { icon: VscVscode, color: "#007acc" },
  Postman: { icon: SiPostman, color: "#ff6c37" },
  "Problem Solving": { icon: FiTarget, color: "#f59e0b" },
  "Team Collaboration": { icon: FiUsers, color: "#8b5cf6" },
  "Time Management": { icon: FiClock, color: "#06b6d4" },
  Adaptability: { icon: FiTrendingUp, color: "#10b981" },
};

export const getSkillIcon = (name) => {
  const item = skillMeta[name];
  return item ? item.icon : FiCode;
};

export const getSkillColor = (name) => {
  const item = skillMeta[name];
  return item ? item.color : "var(--accent)";
};

