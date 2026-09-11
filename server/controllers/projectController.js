import Project from "../models/Project.js";
import { getDbStatus } from "../config/db.js";
import { readStore, writeStore, generateId } from "../utils/localStore.js";

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    } else {
      const store = readStore();
      const projects = (store.projects || []).slice().reverse();
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    }
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, data: project });
    } else {
      const store = readStore();
      const project = (store.projects || []).find((p) => p._id === id || p.slug === id);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, data: project });
    }
  } catch (error) {
    console.error("Get project by id error:", error);
    return res.status(500).json({ success: false, message: "Error fetching project" });
  }
};

// POST /api/projects (Admin)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      badge,
      description,
      highlights,
      tech,
      image,
      github,
      link,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const formattedHighlights = Array.isArray(highlights)
      ? highlights
      : typeof highlights === "string"
      ? highlights.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const formattedTech = Array.isArray(tech)
      ? tech
      : typeof tech === "string"
      ? tech.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newProjectData = {
      title,
      slug,
      category: category || "fullstack",
      badge: badge || "",
      description,
      highlights: formattedHighlights,
      tech: formattedTech,
      image: image || "",
      github: github || "",
      link: link || "",
      featured: Boolean(featured),
    };

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const project = await Project.create(newProjectData);
      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } else {
      const store = readStore();
      const newProject = {
        ...newProjectData,
        _id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.projects = store.projects || [];
      store.projects.push(newProject);
      writeStore(store);

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: newProject,
      });
    }
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ success: false, message: "Error creating project" });
  }
};

// PUT /api/projects/:id (Admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      badge,
      description,
      highlights,
      tech,
      image,
      github,
      link,
      featured,
    } = req.body;

    const formattedHighlights = highlights
      ? Array.isArray(highlights)
        ? highlights
        : typeof highlights === "string"
        ? highlights.split(",").map((s) => s.trim()).filter(Boolean)
        : []
      : undefined;

    const formattedTech = tech
      ? Array.isArray(tech)
        ? tech
        : typeof tech === "string"
        ? tech.split(",").map((s) => s.trim()).filter(Boolean)
        : []
      : undefined;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (slug !== undefined) updateFields.slug = slug;
    if (category !== undefined) updateFields.category = category;
    if (badge !== undefined) updateFields.badge = badge;
    if (description !== undefined) updateFields.description = description;
    if (formattedHighlights !== undefined) updateFields.highlights = formattedHighlights;
    if (formattedTech !== undefined) updateFields.tech = formattedTech;
    if (image !== undefined) updateFields.image = image;
    if (github !== undefined) updateFields.github = github;
    if (link !== undefined) updateFields.link = link;
    if (featured !== undefined) updateFields.featured = Boolean(featured);

    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const updated = await Project.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updated,
      });
    } else {
      const store = readStore();
      const index = (store.projects || []).findIndex((p) => p._id === id || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      store.projects[index] = {
        ...store.projects[index],
        ...updateFields,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);

      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: store.projects[index],
      });
    }
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({ success: false, message: "Error updating project" });
  }
};

// DELETE /api/projects/:id (Admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMongoConnected } = getDbStatus();

    if (isMongoConnected) {
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, message: "Project deleted successfully" });
    } else {
      const store = readStore();
      const initialLength = (store.projects || []).length;
      store.projects = (store.projects || []).filter((p) => p._id !== id && p.slug !== id);

      if (store.projects.length === initialLength) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      writeStore(store);
      return res.status(200).json({ success: true, message: "Project deleted successfully" });
    }
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ success: false, message: "Error deleting project" });
  }
};
