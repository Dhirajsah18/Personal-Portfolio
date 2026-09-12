import mongoose from "mongoose";
import { initLocalStore } from "../utils/localStore.js";

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    console.log("MONGODB_URI is not set. Operating in resilient Local File-Store mode.");
    initLocalStore();
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB connection failed (${error.message}).`);
    console.log("Falling back smoothly to resilient Local File-Store mode (server/data/store.json).");
    initLocalStore();
    isMongoConnected = false;
    return false;
  }
};

export const getDbStatus = () => ({
  isMongoConnected,
  mode: isMongoConnected ? "mongodb" : "local-file-store",
});
