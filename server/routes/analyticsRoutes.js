import express from "express";
import {
  recordVisit,
  recordResumeDownload,
  getStats,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/visit", recordVisit);
router.post("/resume-download", recordResumeDownload);
router.get("/stats", protect, getStats);

export default router;
