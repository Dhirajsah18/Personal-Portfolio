import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["visit", "resume_download"], required: true },
    page: { type: String, default: "/" },
    referrer: { type: String, default: "direct" },
    userAgent: { type: String, default: "" },
    ipHash: { type: String, default: "" },
  },
  { timestamps: true }
);

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
export default Analytics;
