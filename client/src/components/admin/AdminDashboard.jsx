import { useState, useEffect } from "react";
import {
  FiX,
  FiLogOut,
  FiActivity,
  FiFolder,
  FiCpu,
  FiMail,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheckCircle,
  FiExternalLink,
  FiDownload,
  FiEye,
  FiUsers,
  FiRefreshCw,
  FiCornerUpRight,
} from "react-icons/fi";
import { api } from "../../services/api";
import ProjectModal from "./ProjectModal";
import SkillModal from "./SkillModal";

const AdminDashboard = ({ isOpen, onClose, onLogout, onDataUpdated }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsData, projectsData, skillsData, messagesData] = await Promise.allSettled([
        api.getStats(),
        api.getProjects(),
        api.getSkills(),
        api.getMessages(),
      ]);

      if (statsData.status === "fulfilled") setStats(statsData.value);
      if (projectsData.status === "fulfilled") setProjects(projectsData.value);
      if (skillsData.status === "fulfilled") setSkills(skillsData.value);
      if (messagesData.status === "fulfilled") {
        setMessages(messagesData.value.data || []);
        setUnreadCount(messagesData.value.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Project handlers
  const handleSaveProject = async (projectData, id) => {
    if (id) {
      await api.updateProject(id, projectData);
    } else {
      await api.createProject(projectData);
    }
    await fetchAllData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await api.deleteProject(id);
      await fetchAllData();
      if (onDataUpdated) onDataUpdated();
    }
  };

  // Skill handlers
  const handleSaveSkill = async (skillData, id) => {
    if (id) {
      await api.updateSkill(id, skillData);
    } else {
      await api.createSkill(skillData);
    }
    await fetchAllData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill category?")) {
      await api.deleteSkill(id);
      await fetchAllData();
      if (onDataUpdated) onDataUpdated();
    }
  };

  // Message handlers
  const handleToggleMessageRead = async (id, currentStatus) => {
    await api.markMessageRead(id, !currentStatus);
    await fetchAllData();
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Delete this contact message?")) {
      await api.deleteMessage(id);
      await fetchAllData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
      <div
        className="glass w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden relative"
        style={{ borderColor: "var(--glass-border)", background: "var(--bg-card, #0f172a)" }}
      >
        {/* Top Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-white grid place-items-center font-bold font-display shadow-md">
              A
            </div>
            <div>
              <h2 className="text-lg font-bold font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                Portfolio Admin Center
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage your projects, skills, visitor metrics, and contact messages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              disabled={loading}
              title="Refresh data"
              className="p-2.5 rounded-xl glass hover:scale-105 transition-transform"
              style={{ color: "var(--text-secondary)" }}
            >
              <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl glass text-xs font-semibold flex items-center gap-1.5 hover:border-red-500/40 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={14} />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl glass hover:scale-105 transition-transform ml-1"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex items-center gap-2 px-6 py-3 border-b overflow-x-auto shrink-0"
          style={{ borderColor: "var(--glass-border)", background: "rgba(0,0,0,0.15)" }}
        >
          {[
            { id: "overview", label: "Overview & Analytics", icon: FiActivity },
            { id: "projects", label: `Projects (${projects.length})`, icon: FiFolder },
            { id: "skills", label: `Skills (${skills.length})`, icon: FiCpu },
            {
              id: "messages",
              label: "Messages Inbox",
              icon: FiMail,
              badge: unreadCount > 0 ? unreadCount : null,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase">Total Visits</span>
                    <FiEye className="text-[var(--accent)]" size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-display" style={{ color: "var(--text-primary)" }}>
                    {stats?.totalVisits || 0}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Page views recorded</span>
                </div>

                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase">Unique Visitors</span>
                    <FiUsers className="text-emerald-400" size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-display" style={{ color: "var(--text-primary)" }}>
                    {stats?.uniqueVisitors || 0}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Distinct devices / IPs</span>
                </div>

                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase">CV Downloads</span>
                    <FiDownload className="text-cyan-400" size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-display" style={{ color: "var(--text-primary)" }}>
                    {stats?.totalDownloads || 0}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Resume downloads tracked</span>
                </div>

                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase">Inquiries</span>
                    <FiMail className="text-amber-400" size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-display" style={{ color: "var(--text-primary)" }}>
                    {stats?.totalMessages || 0}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                    {stats?.unreadMessages || 0} unread message(s)
                  </span>
                </div>
              </div>

              {/* Recent Activity Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Visits */}
                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <h4 className="text-sm font-bold font-display mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <FiEye style={{ color: "var(--accent)" }} /> Recent Page Visits
                  </h4>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {(!stats?.recentVisits || stats.recentVisits.length === 0) ? (
                      <p className="text-xs text-[var(--text-muted)] py-4 text-center">No visits logged yet.</p>
                    ) : (
                      stats.recentVisits.map((v, i) => (
                        <div
                          key={v._id || i}
                          className="flex items-center justify-between p-3 rounded-xl glass text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold block truncate" style={{ color: "var(--text-primary)" }}>
                              {v.page || "/"}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] block truncate">
                              Ref: {v.referrer || "direct"}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                            {new Date(v.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Resume Downloads */}
                <div className="glass p-5 rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <h4 className="text-sm font-bold font-display mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <FiDownload className="text-cyan-400" /> Recent Resume Downloads
                  </h4>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {(!stats?.recentDownloads || stats.recentDownloads.length === 0) ? (
                      <p className="text-xs text-[var(--text-muted)] py-4 text-center">No downloads tracked yet.</p>
                    ) : (
                      stats.recentDownloads.map((d, i) => (
                        <div
                          key={d._id || i}
                          className="flex items-center justify-between p-3 rounded-xl glass text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold block truncate" style={{ color: "var(--text-primary)" }}>
                              CV Download Event
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] block truncate">
                              Device: {d.userAgent ? d.userAgent.slice(0, 35) + "..." : "Browser"}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-cyan-400 shrink-0">
                            {new Date(d.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    Manage Projects
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Add, edit or delete projects. Changes reflect instantly on your live portfolio.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <FiPlus size={15} /> Add Project
                </button>
              </div>

              <div className="grid gap-3">
                {projects.map((p) => (
                  <div
                    key={p._id || p.slug}
                    className="glass p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                          {p.title}
                        </span>
                        {p.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Featured
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono glass border" style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}>
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(p.tech || []).slice(0, 5).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-md glass font-mono text-[var(--text-secondary)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl glass hover:text-[var(--accent)]"
                          title="View Live"
                        >
                          <FiExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProject(p);
                          setProjectModalOpen(true);
                        }}
                        className="p-2 rounded-xl glass hover:text-[var(--accent)]"
                        title="Edit Project"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p._id || p.slug)}
                        className="p-2 rounded-xl glass hover:text-red-400"
                        title="Delete Project"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    Manage Skills Categories
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Organize your tech stacks, libraries, tools, and capabilities.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setSkillModalOpen(true);
                  }}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <FiPlus size={15} /> Add Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map((s) => (
                  <div
                    key={s._id || s.tag}
                    className="glass p-5 rounded-2xl border flex flex-col justify-between"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                          {s.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border glass text-[var(--text-muted)]" style={{ borderColor: "var(--glass-border)" }}>
                          tag: {s.tag}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(s.items || []).map((item) => (
                          <span
                            key={item}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg glass border"
                            style={{ borderColor: "var(--glass-border)", color: "var(--text-secondary)" }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
                      <button
                        onClick={() => {
                          setSelectedSkill(s);
                          setSkillModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg glass text-xs font-semibold hover:text-[var(--accent)] flex items-center gap-1"
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s._id || s.tag)}
                        className="px-3 py-1.5 rounded-lg glass text-xs font-semibold hover:text-red-400 flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    Contact Messages Inbox
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    All inquiries submitted from your portfolio contact form.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold glass border" style={{ borderColor: "var(--glass-border)", color: "var(--accent)" }}>
                  {messages.length} total • {unreadCount} unread
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="glass p-12 text-center rounded-2xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <FiMail size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">No contact messages yet.</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">When someone submits your contact form, their message will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`glass p-5 rounded-2xl border transition-all ${
                        !m.isRead ? "border-l-4 border-l-[var(--accent)]" : ""
                      }`}
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                            {m.name}
                          </span>
                          <a
                            href={`mailto:${m.email}`}
                            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-mono"
                          >
                            &lt;{m.email}&gt;
                          </a>
                          {!m.isRead && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent)] text-white">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap mb-4 bg-black/20 p-3.5 rounded-xl">
                        {m.message}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${m.email}?subject=Re: Portfolio Inquiry&body=Hi ${m.name},%0D%0A%0D%0AThank you for reaching out!`}
                          className="px-3 py-1.5 rounded-xl glass text-xs font-semibold text-[var(--accent)] hover:scale-105 transition-transform flex items-center gap-1.5"
                        >
                          <FiCornerUpRight size={13} />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          onClick={() => handleToggleMessageRead(m._id, m.isRead)}
                          className="px-3 py-1.5 rounded-xl glass text-xs font-semibold hover:border-[var(--accent)] transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {m.isRead ? "Mark Unread" : "Mark as Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(m._id)}
                          className="p-2 rounded-xl glass hover:text-red-400 transition-colors"
                          title="Delete message"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Child Modals */}
        <ProjectModal
          isOpen={projectModalOpen}
          project={selectedProject}
          onClose={() => setProjectModalOpen(false)}
          onSave={handleSaveProject}
        />

        <SkillModal
          isOpen={skillModalOpen}
          skill={selectedSkill}
          onClose={() => setSkillModalOpen(false)}
          onSave={handleSaveSkill}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
