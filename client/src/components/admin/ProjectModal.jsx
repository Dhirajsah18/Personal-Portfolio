import { useState, useEffect } from "react";
import { FiX, FiCheck, FiLayers } from "react-icons/fi";

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "fullstack",
    badge: "",
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
        badge: project.badge || "",
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
        badge: "",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="glass w-full max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border"
        style={{ borderColor: "var(--glass-border)", background: "var(--bg-card, #121826)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-xl font-bold font-display flex items-center gap-2 mb-6" style={{ color: "var(--text-primary)" }}>
          <FiLayers style={{ color: "var(--accent)" }} />
          {project ? "Edit Project" : "Add New Project"}
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
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
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)", background: "transparent" }}
              >
                <option value="fullstack" className="text-black">Full-Stack MERN</option>
                <option value="ai" className="text-black">AI & Tools</option>
                <option value="backend" className="text-black">Backend & APIs</option>
                <option value="frontend" className="text-black">Frontend UI</option>
                <option value="other" className="text-black">Other</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                Badge / Tagline
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Full-Stack MERN"
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "var(--text-primary)" }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--accent)]"
                />
                Featured on Hero/Top
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of features, problem solved, architecture..."
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
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
            <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
              Tech Stack (comma separated) *
            </label>
            <input
              type="text"
              required
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              placeholder="React, Node.js, Express, MongoDB, Tailwind"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                GitHub URL
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
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                Live Demo Link
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

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold glass hover:border-[var(--accent)]"
              style={{ color: "var(--text-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              <FiCheck size={16} />
              {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
