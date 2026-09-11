import { useState } from "react";
import { FiLock, FiMail, FiX, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "../../services/api";

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.login(email, password);
      localStorage.setItem("portfolio_admin_token", res.token);
      localStorage.setItem("portfolio_admin_user", JSON.stringify(res.user));
      onLoginSuccess(res.token, res.user);
      onClose();
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("dhirajsah2003@gmail.com");
    setPassword("Admin@12345");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="glass w-full max-w-md rounded-3xl p-7 sm:p-9 relative border shadow-2xl"
        style={{ borderColor: "var(--glass-border)", background: "var(--bg-card, #0f172a)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-white grid place-items-center mb-3 shadow-lg">
            <FiLock size={24} />
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
            Admin Portal
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Sign in with JWT credentials to manage portfolio, messages & analytics.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)]">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dhirajsah2003@gmail.com"
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-[var(--text-secondary)]">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                <FiLock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border rounded-xl pl-10 pr-11 py-2.5 text-sm glass focus:ring-2 focus:ring-[var(--accent)] outline-none"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs text-[var(--accent)] hover:underline font-medium"
            >
              Fill Default Demo
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            {loading ? "Authenticating..." : (
              <>
                <FiCheck size={16} /> Authenticate & Access
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
