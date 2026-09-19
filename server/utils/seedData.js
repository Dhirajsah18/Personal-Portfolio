import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "./localStore.js";

export const syncAdminAccount = async () => {
  const { isMongoConnected } = getDbStatus();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    console.log("ℹ️ ADMIN_EMAIL or ADMIN_PASSWORD not defined in environment.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (isMongoConnected) {
    try {
      let admin = await Admin.findOne({ email: adminEmail });
      if (!admin) {
        // If email was changed in env, update existing admin or create a new one
        admin = await Admin.findOne({ role: "admin" });
        if (admin) {
          admin.email = adminEmail;
          admin.password = hashedPassword;
          await admin.save();
          console.log(`👤 Admin updated in MongoDB to match env: ${adminEmail}`);
        } else {
          await Admin.create({
            email: adminEmail,
            password: hashedPassword,
            name: "Portfolio Admin",
            role: "admin",
          });
          console.log(`👤 Admin created in MongoDB: ${adminEmail}`);
        }
      } else {
        // Ensure password is sync'd in case ADMIN_PASSWORD was changed in env
        admin.password = hashedPassword;
        await admin.save();
      }
    } catch (err) {
      console.error("Error during Admin account sync:", err.message);
    }
  } else {
    // Local File Store Admin Sync
    const store = readStore();
    let updated = false;

    if (!store.admins || store.admins.length === 0) {
      store.admins = [
        {
          _id: generateId(),
          email: adminEmail,
          password: hashedPassword,
          name: "Portfolio Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ];
      updated = true;
      console.log(`👤 Admin created in Local Store: ${adminEmail}`);
    } else {
      store.admins[0].email = adminEmail;
      store.admins[0].password = hashedPassword;
      updated = true;
    }

    if (updated) {
      writeStore(store);
    }
  }
};
