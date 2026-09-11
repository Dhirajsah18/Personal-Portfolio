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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="glass w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border"
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
          <FiCpu style={{ color: "var(--accent)" }} />
          {skill ? "Edit Skill Category" : "Add Skill Category"}
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
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
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                Filter Tag (slug) *
              </label>
              <input
                type="text"
                required
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. devops"
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1 text-[var(--text-secondary)]">
              Skill Items (comma separated) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              placeholder="Docker, Kubernetes, AWS, CI/CD, Nginx"
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
            />
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
              {loading ? "Saving..." : skill ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
