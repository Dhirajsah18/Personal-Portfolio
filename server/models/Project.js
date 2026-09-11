import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["fullstack", "ai", "backend", "frontend", "other"],
      default: "fullstack",
    },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    tech: [{ type: String }],
    image: { type: String, default: "" },
    github: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
