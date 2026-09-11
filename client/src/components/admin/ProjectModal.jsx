import { useState, useEffect } from "react";
import { FiX, FiCheck, FiLayers } from "react-icons/fi";

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "fullstack",
    description: "",
    highlights: "",
    tech: "",
    github: "",
    link: "",
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        github: project.github || "",
        link: project.link || "",
        featured: Boolean(project.featured),
      });
    } else {
      setFormData({
        title: "",
        category: "fullstack",
        description: "",
        highlights: "",
        tech: "",
        github: "",
        link: "",
        featured: false,
      });
    }
    setError("");
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        badge: "", // No tagline as requested
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
        {/* Modal Header with Icon, Title and properly positioned Cross Button */}
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
                Manage project information, category, links & stack
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
          <div className="grid sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)", background: "var(--glass-bg)" }}
              >
                <option value="fullstack" className="bg-[#0e1422] text-slate-200">Full-Stack MERN</option>
                <option value="ai" className="bg-[#0e1422] text-slate-200">AI & Tools</option>
                <option value="backend" className="bg-[#0e1422] text-slate-200">Backend & APIs</option>
                <option value="frontend" className="bg-[#0e1422] text-slate-200">Frontend UI</option>
                <option value="other" className="bg-[#0e1422] text-slate-200">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 pb-1">
            <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer select-none" style={{ color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
              />
              <span>Mark as Featured Project (Display prominently on portfolio)</span>
            </label>
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
