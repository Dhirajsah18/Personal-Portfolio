import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    items: [{ type: String, required: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);
export default Skill;
