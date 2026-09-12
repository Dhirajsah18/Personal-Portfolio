import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import Resume from "../models/Resume.js";
import Analytics from "../models/Analytics.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "../utils/localStore.js";
import {
  compressBuffer,
  decompressBuffer,
  isGzipped,
  formatBytes,
} from "../utils/compressionHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../uploads");
const LOCAL_RESUME_FILE = path.join(UPLOADS_DIR, "resume.pdf");
const CLIENT_PUBLIC_RESUME = path.join(__dirname, "../../client/public/resume.pdf");

const hashIp = (ip) => crypto.createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 16);

// Helper to track download event asynchronously
const trackDownloadEvent = async (req) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ipHash = hashIp(String(ip));
    const userAgent = req.headers["user-agent"] || "";

    const { isMongoConnected } = getDbStatus();
    if (isMongoConnected) {
      await Analytics.create({
        type: "resume_download",
        page: "/api/resume/download",
        userAgent,
        ipHash,
      });
    } else {
      const store = readStore();
      store.analytics = store.analytics || { visits: [], resumeDownloads: [], totalVisits: 0, totalDownloads: 0 };
      store.analytics.totalDownloads = (store.analytics.totalDownloads || 0) + 1;
      store.analytics.resumeDownloads = store.analytics.resumeDownloads || [];
      store.analytics.resumeDownloads.push({
        _id: generateId(),
        type: "resume_download",
        userAgent,
        ipHash,
        createdAt: new Date().toISOString(),
      });
      if (store.analytics.resumeDownloads.length > 500) {
        store.analytics.resumeDownloads = store.analytics.resumeDownloads.slice(-500);
      }
      writeStore(store);
    }
  } catch (err) {
    console.error("Error auto-tracking resume download:", err);
  }
};

// GET /api/resume (Public)
export const getResumeInfo = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();
    let resumeDoc = null;
    let totalDownloads = 0;

    // Get total download stats
    if (isMongoConnected) {
      totalDownloads = await Analytics.countDocuments({ type: "resume_download" });
      resumeDoc = await Resume.findOne().sort({ updatedAt: -1 });
    } else {
      const store = readStore();
      totalDownloads = store.analytics?.totalDownloads || store.analytics?.resumeDownloads?.length || 0;
      resumeDoc = store.resume || null;
    }

    // Default fallback to local disk stats if no db record yet
    let filename = resumeDoc?.filename || "Dhiraj_Kumar_Sah_Resume.pdf";
    let originalName = resumeDoc?.originalName || "resume.pdf";
    let size = resumeDoc?.size || 0;
    let customUrl = resumeDoc?.customUrl || "";
    let updatedAt = resumeDoc?.updatedAt || null;

    if (!size) {
      if (fs.existsSync(LOCAL_RESUME_FILE)) {
        const stats = fs.statSync(LOCAL_RESUME_FILE);
        size = stats.size;
        if (!updatedAt) updatedAt = stats.mtime;
      } else if (fs.existsSync(CLIENT_PUBLIC_RESUME)) {
        const stats = fs.statSync(CLIENT_PUBLIC_RESUME);
        size = stats.size;
        if (!updatedAt) updatedAt = stats.mtime;
      }
    }

    const compressedSize = resumeDoc?.compressedSize || null;
    const isCompressedDoc = Boolean(resumeDoc?.isCompressed);

    return res.status(200).json({
      success: true,
      data: {
        filename,
        originalName,
        size,
        sizeFormatted: formatBytes(size),
        compressedSize,
        compressedSizeFormatted: compressedSize ? formatBytes(compressedSize) : null,
        isCompressed: isCompressedDoc,
        contentType: "application/pdf",
        url: customUrl.trim() !== "" ? customUrl.trim() : "/api/resume/download",
        downloadUrl: "/api/resume/download",
        customUrl,
        updatedAt: updatedAt || new Date().toISOString(),
        totalDownloads,
        hasCustomUrl: Boolean(customUrl.trim() !== ""),
      },
    });
  } catch (error) {
    console.error("Get resume info error:", error);
    return res.status(500).json({ success: false, message: "Error fetching resume info" });
  }
};

// GET /api/resume/download (Public)
export const downloadResume = async (req, res) => {
  try {
    // Record download asynchronously
    trackDownloadEvent(req);

    const { isMongoConnected } = getDbStatus();
    let resumeDoc = null;

    if (isMongoConnected) {
      resumeDoc = await Resume.findOne().sort({ updatedAt: -1 });
    }

    const filename = resumeDoc?.filename || "Dhiraj_Kumar_Sah_Resume.pdf";
    const isForceDownload = req.query.download === "true";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${isForceDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    // 1. Check MongoDB binary buffer
    if (resumeDoc?.data && resumeDoc.data.length > 0) {
      const dataIsGzip = isGzipped(resumeDoc.data);
      const acceptsGzip = (req.headers["accept-encoding"] || "").includes("gzip");

      if (dataIsGzip) {
        if (acceptsGzip) {
          res.setHeader("Content-Encoding", "gzip");
          return res.end(resumeDoc.data);
        } else {
          const decompressed = decompressBuffer(resumeDoc.data);
          return res.end(decompressed);
        }
      } else {
        return res.end(resumeDoc.data);
      }
    }

    // 2. Check local server uploads file
    if (fs.existsSync(LOCAL_RESUME_FILE)) {
      return res.sendFile(LOCAL_RESUME_FILE);
    }

    // 3. Check client public fallback file
    if (fs.existsSync(CLIENT_PUBLIC_RESUME)) {
      return res.sendFile(CLIENT_PUBLIC_RESUME);
    }

    return res.status(404).json({ success: false, message: "Resume file not found" });
  } catch (error) {
    console.error("Download resume error:", error);
    return res.status(500).json({ success: false, message: "Error downloading resume" });
  }
};

// POST /api/resume/upload (Protected Admin)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a PDF file to upload" });
    }

    const file = req.file;

    // Strict validation: must be PDF
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return res.status(400).json({ success: false, message: "Only PDF documents are supported" });
    }

    // Compress buffer with Level 9 Gzip before saving to database
    const compressedBuffer = compressBuffer(file.buffer);
    const isComp = isGzipped(compressedBuffer);
    const compressedSize = compressedBuffer.length;
    const savingsPercent = Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100));

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Save uncompressed to server/uploads/resume.pdf for direct server disk compatibility
    fs.writeFileSync(LOCAL_RESUME_FILE, file.buffer);

    // Also sync to client/public/resume.pdf if directory exists
    try {
      const clientPublicDir = path.dirname(CLIENT_PUBLIC_RESUME);
      if (fs.existsSync(clientPublicDir)) {
        fs.writeFileSync(CLIENT_PUBLIC_RESUME, file.buffer);
      }
    } catch (syncErr) {
      console.warn("Could not sync to client/public:", syncErr.message);
    }

    const { isMongoConnected } = getDbStatus();
    let updatedRecord = null;

    if (isMongoConnected) {
      let resume = await Resume.findOne();
      if (!resume) {
        resume = new Resume();
      }
      resume.filename = file.originalname || "Dhiraj_Kumar_Sah_Resume.pdf";
      resume.originalName = file.originalname || "resume.pdf";
      resume.contentType = "application/pdf";
      resume.size = file.size;
      resume.compressedSize = compressedSize;
      resume.isCompressed = isComp;
      resume.data = compressedBuffer;
      resume.customUrl = "";
      resume.updatedAt = new Date();
      await resume.save();
      updatedRecord = resume;
    } else {
      const store = readStore();
      store.resume = {
        filename: file.originalname || "Dhiraj_Kumar_Sah_Resume.pdf",
        originalName: file.originalname || "resume.pdf",
        size: file.size,
        compressedSize: compressedSize,
        isCompressed: isComp,
        customUrl: "",
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      updatedRecord = store.resume;
    }

    return res.status(200).json({
      success: true,
      message: `Resume successfully uploaded and compressed! (${savingsPercent}% storage saved)`,
      data: {
        filename: updatedRecord.filename,
        originalName: updatedRecord.originalName,
        size: updatedRecord.size,
        sizeFormatted: formatBytes(updatedRecord.size),
        compressedSize,
        compressedSizeFormatted: formatBytes(compressedSize),
        savingsPercent: `${savingsPercent}%`,
        url: "/api/resume/download",
        updatedAt: updatedRecord.updatedAt,
      },
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload resume" });
  }
};

// PUT /api/resume/url (Protected Admin)
export const updateResumeUrl = async (req, res) => {
  try {
    const { customUrl } = req.body;
    const sanitizedUrl = typeof customUrl === "string" ? customUrl.trim() : "";

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      let resume = await Resume.findOne();
      if (!resume) {
        resume = new Resume();
      }
      resume.customUrl = sanitizedUrl;
      resume.updatedAt = new Date();
      await resume.save();
    } else {
      const store = readStore();
      store.resume = store.resume || {};
      store.resume.customUrl = sanitizedUrl;
      store.resume.updatedAt = new Date().toISOString();
      writeStore(store);
    }

    return res.status(200).json({
      success: true,
      message: sanitizedUrl ? "External resume link updated" : "Reset to uploaded PDF resume",
      url: sanitizedUrl || "/api/resume/download",
    });
  } catch (error) {
    console.error("Update resume URL error:", error);
    return res.status(500).json({ success: false, message: "Failed to update resume URL" });
  }
};
