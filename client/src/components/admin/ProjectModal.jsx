import { useState, useEffect, useRef } from "react";
import { FiX, FiCheck, FiLayers, FiUploadCloud, FiTrash2, FiLink } from "react-icons/fi";

// Browser-side canvas resizer to keep payloads optimized and ultra-fast
const compressImageInBrowser = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = maxHeight;
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to WebP data URL or JPEG fallback
        const compressedDataUrl = canvas.toDataURL("image/webp", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "fullstack",
    description: "",
    highlights: "",
    tech: "",
    image: "",
    github: "",
    link: "",
    featured: false,
  });
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        category: project.category || "fullstack",
        description: project.description || "",
        highlights: Array.isArray(project.highlights)
          ? project.highlights.join(", ")
          : project.highlights || "",
        tech: Array.isArray(project.tech)
          ? project.tech.join(", ")
          : project.tech || "",
        image: project.image || "",
        github: project.github || "",
        link: project.link || "",
        featured: Boolean(project.featured),
      });
      setShowUrlInput(Boolean(project.image && project.image.startsWith("http")));
    } else {
      setFormData({
        title: "",
        category: "fullstack",
        description: "",
        highlights: "",
        tech: "",
        image: "",
        github: "",
        link: "",
        featured: false,
      });
      setShowUrlInput(false);
    }
    setError("");
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size is too large (Maximum 5MB allowed)");
      return;
    }

    try {
      const compressedDataUrl = await compressImageInBrowser(file);
      setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      setError("");
    } catch (err) {
      setError("Could not process image: " + err.message);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size is too large (Maximum 5MB allowed)");
        return;
      }
      try {
        const compressedDataUrl = await compressImageInBrowser(file);
        setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
        setError("");
      } catch (err) {
        setError("Could not process dropped image: " + err.message);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        badge: "",
        highlights: formData.highlights
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tech: formData.tech
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await onSave(payload, project ? (project._id || project.slug) : null);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="glass modal-glow w-full max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border shadow-2xl"
        style={{ borderColor: "var(--glass-border)", background: "var(--modal-bg)" }}
      >
        {/* Modal Header with Icon, Title and Cross Button */}
        <div
          className="flex items-center justify-between pb-5 mb-5 border-b"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ background: "var(--accent-gradient)" }}
            >
              <FiLayers size={18} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
                {project ? "Edit Project Details" : "Create New Project"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Manage project information, cover image, links & stack
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full glass border flex items-center justify-center hover:scale-110 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:rotate-90 transition-all cursor-pointer shadow-sm shrink-0"
            style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)" }}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. V-Tube — Video Platform"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="flex items-center gap-2 pt-0.5 pb-0.5">
            <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer select-none" style={{ color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
              />
              <span>Mark as Featured Project</span>
            </label>
          </div>

          {/* Project Cover Image Upload / Management Section */}
          <div className="border rounded-2xl p-4 glass" style={{ borderColor: "var(--glass-border)" }}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Project Cover Image
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <FiLink size={12} />
                {showUrlInput ? "Upload File Instead" : "Paste Image URL"}
              </button>
            </div>

            {formData.image ? (
              <div className="relative rounded-2xl overflow-hidden border bg-slate-950/80 group" style={{ borderColor: "var(--glass-border)" }}>
                <img
                  src={formData.image}
                  alt="Cover Preview"
                  className="w-full h-44 object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <FiUploadCloud size={14} />
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ) : showUrlInput ? (
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
                />
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Enter direct image URL.
                </p>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all text-center"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  <FiUploadCloud size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    Click to browse or drag & drop cover image
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Auto-compressed to WebP & uploaded to Cloudinary
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Concise overview of features, problem solved, architecture..."
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
              Highlights (comma separated)
            </label>
            <input
              type="text"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              placeholder="10+ Secure Endpoints, JWT Auth, Cloud Uploads"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
              Tech Stack (comma separated) *
            </label>
            <input
              type="text"
              required
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
                Live Deployment URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t" style={{ borderColor: "var(--glass-border)" }}>
            <button
              type="button"
              onClick={onClose}
              className="glass pill-hover px-5 py-2.5 rounded-2xl text-xs font-semibold border"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-shine px-6 py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-2 shadow-md"
            >
              <FiCheck size={16} />
              <span>{loading ? "Saving Changes..." : project ? "Save Updates" : "Create Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
