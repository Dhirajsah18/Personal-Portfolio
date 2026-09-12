import express from "express";
import multer from "multer";
import {
  getResumeInfo,
  downloadResume,
  uploadResume,
  updateResumeUrl,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Setup Multer memory storage for direct file upload & DB saving
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files (.pdf) are allowed!"), false);
    }
  },
});

// Public endpoints
router.get("/", getResumeInfo);
router.get("/download", downloadResume);

// Protected admin endpoints
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.put("/url", protect, updateResumeUrl);

export default router;
