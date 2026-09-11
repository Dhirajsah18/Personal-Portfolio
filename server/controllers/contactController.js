import Message from "../models/Message.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "../utils/localStore.js";

// POST /api/contact (Public)
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      isRead: false,
      ip: String(ip),
    };

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const savedMessage = await Message.create(messageData);
      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been received and saved.",
        data: { id: savedMessage._id },
      });
    } else {
      const store = readStore();
      const savedMessage = {
        ...messageData,
        _id: generateId(),
        createdAt: new Date().toISOString(),
      };
      store.messages = store.messages || [];
      store.messages.push(savedMessage);
      writeStore(store);

      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been received and saved.",
        data: { id: savedMessage._id },
      });
    }
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error saving message. Please try again later.",
    });
  }
};

// GET /api/contact (Admin)
export const getMessages = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const messages = await Message.find().sort({ createdAt: -1 });
      const unreadCount = await Message.countDocuments({ isRead: false });
      return res.status(200).json({
        success: true,
        count: messages.length,
        unreadCount,
        data: messages,
      });
    } else {
      const store = readStore();
      const messages = (store.messages || []).slice().reverse();
      const unreadCount = messages.filter((m) => !m.isRead).length;
      return res.status(200).json({
        success: true,
        count: messages.length,
        unreadCount,
        data: messages,
      });
    }
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};

// PATCH /api/contact/:id/read (Admin)
export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead = true } = req.body;
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const message = await Message.findByIdAndUpdate(
        id,
        { isRead: Boolean(isRead) },
        { new: true }
      );
      if (!message) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
      return res.status(200).json({ success: true, data: message });
    } else {
      const store = readStore();
      const index = (store.messages || []).findIndex((m) => m._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }

      store.messages[index].isRead = Boolean(isRead);
      writeStore(store);
      return res.status(200).json({ success: true, data: store.messages[index] });
    }
  } catch (error) {
    console.error("Mark read error:", error);
    return res.status(500).json({ success: false, message: "Error updating message status" });
  }
};

// DELETE /api/contact/:id (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const deleted = await Message.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
      return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } else {
      const store = readStore();
      const initialLen = (store.messages || []).length;
      store.messages = (store.messages || []).filter((m) => m._id !== id);

      if (store.messages.length === initialLen) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }

      writeStore(store);
      return res.status(200).json({ success: true, message: "Message deleted successfully" });
    }
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({ success: false, message: "Error deleting message" });
  }
};
