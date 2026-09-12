import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

// Default initial store
const defaultData = {
  projects: [],
  skills: [],
  messages: [],
  admins: [],
  analytics: {
    visits: [],
    resumeDownloads: [],
    totalVisits: 0,
    totalDownloads: 0,
  },
  resume: {
    filename: "Dhiraj_Kumar_Sah_Resume.pdf",
    originalName: "resume.pdf",
    size: 0,
    customUrl: "",
    updatedAt: null,
  },
};

export const initLocalStore = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
  }
};

export const readStore = () => {
  initLocalStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local store, resetting default:", err);
    return { ...defaultData };
  }
};

export const writeStore = (data) => {
  initLocalStore();
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing to local store:", err);
    return false;
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};
