import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { getDbStatus } from "../config/db.js";
import { readStore } from "../utils/localStore.js";

const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || "super_secret_portfolio_jwt_key_2026_dhiraj",
    { expiresIn: "7d" }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const { isMongoConnected } = getDbStatus();
    let adminUser = null;

    if (isMongoConnected) {
      adminUser = await Admin.findOne({ email: email.toLowerCase() });
    } else {
      const store = readStore();
      adminUser = (store.admins || []).find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(adminUser._id, adminUser.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name || "Dhiraj Kumar Sah",
        role: adminUser.role || "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();
    let adminUser = null;

    if (isMongoConnected) {
      adminUser = await Admin.findById(req.user.id).select("-password");
    } else {
      const store = readStore();
      adminUser = (store.admins || []).find((a) => a._id === req.user.id);
      if (adminUser) {
        const { password, ...safeUser } = adminUser;
        adminUser = safeUser;
      }
    }

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: adminUser,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving profile",
    });
  }
};
