import crypto from "crypto";
import Analytics from "../models/Analytics.js";
import Message from "../models/Message.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "../utils/localStore.js";

// Helper to hash IP for privacy while keeping uniqueness
const hashIp = (ip) => {
  if (!ip) return "anonymous";
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
};

// POST /api/analytics/visit (Public)
export const recordVisit = async (req, res) => {
  try {
    const { page = "/", referrer = "direct" } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ipHash = hashIp(String(ip));
    const userAgent = req.headers["user-agent"] || "";

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      await Analytics.create({
        type: "visit",
        page,
        referrer,
        userAgent,
        ipHash,
      });
      return res.status(200).json({ success: true, message: "Visit logged" });
    } else {
      const store = readStore();
      store.analytics = store.analytics || { visits: [], resumeDownloads: [], totalVisits: 0, totalDownloads: 0 };
      store.analytics.totalVisits = (store.analytics.totalVisits || 0) + 1;
      store.analytics.visits = store.analytics.visits || [];
      store.analytics.visits.push({
        _id: generateId(),
        type: "visit",
        page,
        referrer,
        userAgent,
        ipHash,
        createdAt: new Date().toISOString(),
      });

      // Keep visits array capped at 500 in local store
      if (store.analytics.visits.length > 500) {
        store.analytics.visits = store.analytics.visits.slice(-500);
      }

      writeStore(store);
      return res.status(200).json({ success: true, message: "Visit logged" });
    }
  } catch (error) {
    console.error("Record visit error:", error);
    return res.status(500).json({ success: false, message: "Error logging visit" });
  }
};

// POST /api/analytics/resume-download (Public)
export const recordResumeDownload = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ipHash = hashIp(String(ip));
    const userAgent = req.headers["user-agent"] || "";

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      await Analytics.create({
        type: "resume_download",
        page: "/resume.pdf",
        userAgent,
        ipHash,
      });
      return res.status(200).json({ success: true, message: "Resume download tracked" });
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
      return res.status(200).json({ success: true, message: "Resume download tracked" });
    }
  } catch (error) {
    console.error("Record resume download error:", error);
    return res.status(500).json({ success: false, message: "Error tracking download" });
  }
};

// GET /api/analytics/stats (Admin)
export const getStats = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const totalVisits = await Analytics.countDocuments({ type: "visit" });
      const totalDownloads = await Analytics.countDocuments({ type: "resume_download" });
      const uniqueVisits = await Analytics.distinct("ipHash", { type: "visit" });
      const totalMessages = await Message.countDocuments();
      const unreadMessages = await Message.countDocuments({ isRead: false });
      const recentVisits = await Analytics.find({ type: "visit" })
        .sort({ createdAt: -1 })
        .limit(10);
      const recentDownloads = await Analytics.find({ type: "resume_download" })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        data: {
          totalVisits,
          uniqueVisitors: uniqueVisits.length,
          totalDownloads,
          totalMessages,
          unreadMessages,
          recentVisits,
          recentDownloads,
        },
      });
    } else {
      const store = readStore();
      const visits = store.analytics?.visits || [];
      const downloads = store.analytics?.resumeDownloads || [];
      const messages = store.messages || [];

      const uniqueIps = new Set(visits.map((v) => v.ipHash));
      const totalVisits = store.analytics?.totalVisits || visits.length;
      const totalDownloads = store.analytics?.totalDownloads || downloads.length;

      return res.status(200).json({
        success: true,
        data: {
          totalVisits,
          uniqueVisitors: uniqueIps.size,
          totalDownloads,
          totalMessages: messages.length,
          unreadMessages: messages.filter((m) => !m.isRead).length,
          recentVisits: visits.slice(-10).reverse(),
          recentDownloads: downloads.slice(-10).reverse(),
        },
      });
    }
  } catch (error) {
    console.error("Get analytics stats error:", error);
    return res.status(500).json({ success: false, message: "Error fetching analytics stats" });
  }
};
