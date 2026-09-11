import { useState, useEffect } from "react";
import { FiX, FiCheck, FiCpu } from "react-icons/fi";

const SkillModal = ({ isOpen, onClose, onSave, skill }) => {
  const [formData, setFormData] = useState({
    category: "",
    tag: "",
    items: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (skill) {
      setFormData({
        category: skill.category || "",
        tag: skill.tag || "",
        items: Array.isArray(skill.items) ? skill.items.join(", ") : skill.items || "",
        order: skill.order || 0,
      });
    } else {
      setFormData({
        category: "",
        tag: "",
        items: "",
        order: 0,
      });
    }
    setError("");
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        category: formData.category.trim(),
        tag: formData.tag.trim().toLowerCase(),
        items: formData.items
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        order: Number(formData.order) || 0,
      };

      await onSave(payload, skill ? (skill._id || skill.tag) : null);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save skill category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="glass modal-glow w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border shadow-2xl"
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
              <FiCpu size={18} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
                {skill ? "Edit Skill Category" : "Add Skill Category"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Configure skill title, tag & capabilities
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
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g. Cloud & DevOps"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
                Tag Slug *
              </label>
              <input
                type="text"
                required
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. cloud"
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)] font-semibold">
              Skills (comma separated) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              placeholder="Docker, AWS (EC2, S3), CI/CD GitHub Actions, Vercel, Render"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
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
              <span>{loading ? "Saving..." : skill ? "Save Updates" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
