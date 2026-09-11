import Skill from "../models/Skill.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "../utils/localStore.js";

// GET /api/skills
export const getSkills = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
      return res.status(200).json({ success: true, count: skills.length, data: skills });
    } else {
      const store = readStore();
      const skills = (store.skills || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: skills.length, data: skills });
    }
  } catch (error) {
    console.error("Get skills error:", error);
    return res.status(500).json({ success: false, message: "Error fetching skills" });
  }
};

// POST /api/skills (Admin)
export const createSkill = async (req, res) => {
  try {
    const { category, tag, items, order } = req.body;

    if (!category || !tag) {
      return res.status(400).json({
        success: false,
        message: "Category and tag are required",
      });
    }

    const formattedItems = Array.isArray(items)
      ? items
      : typeof items === "string"
      ? items.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const skillData = {
      category,
      tag: tag.toLowerCase().trim(),
      items: formattedItems,
      order: order ? Number(order) : 0,
    };

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const newSkill = await Skill.create(skillData);
      return res.status(201).json({
        success: true,
        message: "Skill category created",
        data: newSkill,
      });
    } else {
      const store = readStore();
      const newSkill = {
        ...skillData,
        _id: generateId(),
        createdAt: new Date().toISOString(),
      };
      store.skills = store.skills || [];
      store.skills.push(newSkill);
      writeStore(store);

      return res.status(201).json({
        success: true,
        message: "Skill category created",
        data: newSkill,
      });
    }
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({ success: false, message: "Error creating skill category" });
  }
};

// PUT /api/skills/:id (Admin)
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, tag, items, order } = req.body;

    const formattedItems = items
      ? Array.isArray(items)
        ? items
        : typeof items === "string"
        ? items.split(",").map((s) => s.trim()).filter(Boolean)
        : []
      : undefined;

    const updateFields = {};
    if (category !== undefined) updateFields.category = category;
    if (tag !== undefined) updateFields.tag = tag.toLowerCase().trim();
    if (formattedItems !== undefined) updateFields.items = formattedItems;
    if (order !== undefined) updateFields.order = Number(order);

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const updated = await Skill.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Skill not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Skill category updated",
        data: updated,
      });
    } else {
      const store = readStore();
      const index = (store.skills || []).findIndex((s) => s._id === id || s.tag === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Skill not found" });
      }

      store.skills[index] = {
        ...store.skills[index],
        ...updateFields,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);

      return res.status(200).json({
        success: true,
        message: "Skill category updated",
        data: store.skills[index],
      });
    }
  } catch (error) {
    console.error("Update skill error:", error);
    return res.status(500).json({ success: false, message: "Error updating skill" });
  }
};

// DELETE /api/skills/:id (Admin)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const deleted = await Skill.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Skill category not found" });
      }
      return res.status(200).json({ success: true, message: "Skill category deleted" });
    } else {
      const store = readStore();
      const initialLength = (store.skills || []).length;
      store.skills = (store.skills || []).filter((s) => s._id !== id && s.tag !== id);

      if (store.skills.length === initialLength) {
        return res.status(404).json({ success: false, message: "Skill category not found" });
      }

      writeStore(store);
      return res.status(200).json({ success: true, message: "Skill category deleted" });
    }
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({ success: false, message: "Error deleting skill" });
  }
};
