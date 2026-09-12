import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      default: "Dhiraj_Kumar_Sah_Resume.pdf",
    },
    originalName: {
      type: String,
      default: "resume.pdf",
    },
    contentType: {
      type: String,
      default: "application/pdf",
    },
    size: {
      type: Number,
      default: 0,
    },
    compressedSize: {
      type: Number,
      default: 0,
    },
    isCompressed: {
      type: Boolean,
      default: false,
    },
    customUrl: {
      type: String,
      default: "",
    },
    data: {
      type: Buffer,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
