
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

export const skillIcons = {
  JavaScript: SiJavascript,
  "C++": SiCplusplus,
  Python: SiPython,
  HTML5: SiHtml5,
  CSS3: SiCss,
  SQL: FiDatabase,
  React: SiReact,
  Vite: SiVite,
  "Tailwind CSS": SiTailwindcss,
  "Responsive UI": FiSmartphone,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "REST APIs": FiGlobe,
  "JWT Auth": SiJsonwebtokens,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Postman: SiPostman,
  "Problem Solving": FiTarget,
  "Team Collaboration": FiUsers,
  "Time Management": FiClock,
  Adaptability: FiTrendingUp,
};

export const getSkillIcon = (name) => skillIcons[name] || FiCode;
