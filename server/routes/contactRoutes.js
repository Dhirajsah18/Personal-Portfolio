import express from "express";
import {
  sendMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markMessageRead);
router.delete("/:id", protect, deleteMessage);

export default router;
