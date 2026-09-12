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
  FiExternalLink,
  FiGithub,
  FiDownload,
  FiEye,
  FiUsers,
  FiRefreshCw,
  FiCornerUpRight,
  FiArrowLeft,
  FiMenu,
  FiCheck,
  FiMove,
  FiChevronUp,
  FiChevronDown,
  FiLayers,
  FiFileText,
} from "react-icons/fi";
import { api } from "../../services/api";
import ProjectModal from "./ProjectModal";
import SkillModal from "./SkillModal";
import ResumeManager from "./ResumeManager";
import videoSummarizerImg from "../../assets/video-summarizer.webp";
import creativeShowcaseImg from "../../assets/creative-showcase.webp";
import vtubeImg from "/vtube.webp";

const imageMap = {
  "video-summarizer": videoSummarizerImg,
  "creative-showcase": creativeShowcaseImg,
  vtube: vtubeImg,
};

const AdminDashboard = ({ isOpen, onClose, onLogout, onDataUpdated }) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [projectFilter, setProjectFilter] = useState("all");
  const [messageFilter, setMessageFilter] = useState("all");

  // Drag and drop states for projects
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [orderSavedToast, setOrderSavedToast] = useState(false);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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

  // Drag & Drop Reordering Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...projects];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setProjects(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    await saveNewOrder(reordered);
  };

  const handleMoveProject = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setProjects(reordered);
    await saveNewOrder(reordered);
  };

  const saveNewOrder = async (orderedList) => {
    setIsReordering(true);
    try {
      const projectIds = orderedList.map((p) => p._id || p.slug);
      await api.reorderProjects(projectIds);
      setOrderSavedToast(true);
      setTimeout(() => setOrderSavedToast(false), 3000);
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      console.error("Failed to reorder projects:", err);
      fetchAllData();
    } finally {
      setIsReordering(false);
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

  const filteredProjects =
    projectFilter === "all"
      ? projects
      : projects.filter((p) => p.category === projectFilter);

  const filteredMessages =
    messageFilter === "all"
      ? messages
      : messageFilter === "unread"
      ? messages.filter((m) => !m.isRead)
      : messages.filter((m) => m.isRead);

  const navItems = [
    { id: "projects", label: "Projects Manager", icon: FiFolder, count: projects.length },
    { id: "overview", label: "Analytics Overview", icon: FiActivity },
    { id: "skills", label: "Skills & Capabilities", icon: FiCpu, count: skills.length },
    { id: "resume", label: "Resume / CV", icon: FiFileText },
    {
      id: "messages",
      label: "Messages Inbox",
      icon: FiMail,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen flex overflow-hidden font-sans"
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      {/* Background Aurora Orbs for Frontend Visual Consistency */}
      <div className="bg-orbs fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="orb-1" />
        <span className="orb-2" />
        <span className="orb-3" />
      </div>

      {/* Background Dot Grid */}
      <div className="bg-grid fixed inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
        />
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 flex flex-col shrink-0 transition-transform duration-300 ease-in-out border-r glass backdrop-blur-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
          borderRadius: 0,
        }}
      >
        {/* Brand Header */}
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-display font-black text-xl shadow-lg shrink-0"
              style={{ background: "var(--accent-gradient)" }}
            >
              D
            </div>
            <div className="flex flex-col items-start">
              <h2 className="font-bold font-display text-base tracking-tight flex items-center">
                <span>Dhiraj</span>
                <span style={{ color: "var(--accent)" }}>.dev</span>
              </h2>
              <div className="mt-1">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold inline-block"
                  style={{
                    borderColor: "var(--glass-border)",
                    color: "var(--accent)",
                    background: "var(--glass-bg)",
                  }}
                >
                  Admin
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl glass"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close Sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <p
              className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              Management
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 border ${
                      isActive
                        ? "text-white border-transparent shadow-lg scale-[1.02]"
                        : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:translate-x-1"
                    }`}
                    style={
                      isActive
                        ? {
                            background: "var(--accent-gradient)",
                            boxShadow: "0 8px 20px -4px rgba(234, 88, 12, 0.35)",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        style={{ color: isActive ? "#ffffff" : "var(--accent)" }}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center animate-pulse shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && !item.badge && (
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: "var(--glass-border)",
                          color: isActive ? "#ffffff" : "var(--text-muted)",
                          background: isActive ? "rgba(0,0,0,0.2)" : "var(--glass-bg)",
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom Footer */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: "var(--glass-border)" }}
        >
          {/* Back to Site Button */}
          <button
            onClick={onClose}
            className="w-full glass pill-hover flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--text-primary)",
            }}
          >
            <FiArrowLeft size={14} style={{ color: "var(--accent)" }} />
            <span>Back to Portfolio</span>
          </button>

          {/* Sign Out Button with Red Border */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border border-rose-500/50 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500 hover:text-rose-300 transition-all cursor-pointer shadow-sm group"
          >
            <FiLogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navigation Bar */}
        <header
          className="h-16 border-b px-6 flex items-center justify-between shrink-0 glass backdrop-blur-2xl"
          style={{
            borderColor: "var(--glass-border)",
            borderRadius: 0,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl glass border border-[var(--glass-border)]"
              style={{ color: "var(--text-primary)" }}
              aria-label="Open Sidebar"
            >
              <FiMenu size={18} />
            </button>
            <h1 className="text-base sm:text-lg font-bold font-display" style={{ color: "var(--text-primary)" }}>
              {activeTab === "projects" && "Projects Manager"}
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "skills" && "Skills & Capabilities"}
              {activeTab === "resume" && "Resume & CV Management"}
              {activeTab === "messages" && "Messages Inbox"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAllData}
              disabled={loading}
              title="Refresh Data"
              className="glass pill-hover flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
              }}
            >
              <FiRefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
                style={{ color: "var(--accent)" }}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab === "projects" && (
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setProjectModalOpen(true);
                }}
                className="btn-primary btn-shine hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shadow-md"
              >
                <FiPlus size={15} />
                <span>Add Project</span>
              </button>
            )}

            {activeTab === "skills" && (
              <button
                onClick={() => {
                  setSelectedSkill(null);
                  setSkillModalOpen(true);
                }}
                className="btn-primary btn-shine hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shadow-md"
              >
                <FiPlus size={15} />
                <span>Add Category</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="glass icon-ring p-2 rounded-xl border transition-colors ml-1"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
              }}
              title="Close and Return to Portfolio"
            >
              <FiX size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* ===================== TAB: PROJECTS MANAGER ===================== */}
          {activeTab === "projects" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Category Filter Tabs matching Frontend Projects */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5 overflow-x-auto p-2 pl-3">
                  {[
                    { id: "all", label: "All Projects" },
                    { id: "fullstack", label: "Full-Stack MERN" },
                    { id: "ai", label: "AI & Tools" },
                    { id: "backend", label: "Backend & APIs" },
                    { id: "frontend", label: "Frontend UI" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProjectFilter(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border shrink-0 ${
                        projectFilter === tab.id
                          ? "text-white border-transparent shadow-md scale-105"
                          : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:scale-[1.02]"
                      }`}
                      style={
                        projectFilter === tab.id
                          ? {
                              background: "var(--accent-gradient)",
                              boxShadow: "0 4px 16px -2px rgba(234, 88, 12, 0.35)",
                            }
                          : {}
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {isReordering ? (
                    <span className="text-xs font-mono flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                      Syncing...
                    </span>
                  ) : orderSavedToast ? (
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <FiCheck size={14} /> Synced!
                    </span>
                  ) : null}

                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    Showing {filteredProjects.length} of {projects.length}
                  </span>
                </div>
              </div>

              {/* Projects Grid with Rich Cards matching Frontend design */}
              <div className="grid md:grid-cols-2 gap-7">
                {filteredProjects.map((p) => {
                  const globalIndex = projects.findIndex((item) => (item._id || item.slug) === (p._id || p.slug));
                  const isDraggable = projectFilter === "all";
                  const img = p.image ? (imageMap[p.image] || p.image) : null;

                  return (
                    <div
                      key={p._id || p.slug}
                      draggable={isDraggable}
                      onDragStart={(e) => isDraggable && handleDragStart(e, globalIndex)}
                      onDragOver={(e) => isDraggable && handleDragOver(e, globalIndex)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => isDraggable && handleDrop(e, globalIndex)}
                      className={`glass card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all group relative border ${
                        draggedIndex === globalIndex
                          ? "opacity-30 border-dashed border-[var(--accent)] scale-95"
                          : dragOverIndex === globalIndex
                          ? "border-[var(--accent)] ring-2 ring-[var(--accent)] scale-[1.02]"
                          : "border-[var(--glass-border)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <div>
                        {/* Preview Image / Header banner */}
                        {img ? (
                          <div className="relative rounded-2xl overflow-hidden mb-5 h-48 bg-slate-950 border border-[var(--glass-border)]">
                            <img
                              src={img}
                              alt={p.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                            {/* Floating Top Bar on Image: Order Rank + Move Controls + Quick Actions */}
                            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                              {/* Left: Rank & Move Controls */}
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 shadow-sm text-xs font-mono font-bold text-white"
                                  title="Position on live portfolio"
                                >
                                  {isDraggable && (
                                    <span
                                      className="cursor-grab active:cursor-grabbing text-orange-400 mr-0.5 hover:text-white"
                                      title="Drag to reorder"
                                    >
                                      <FiMove size={13} />
                                    </span>
                                  )}
                                  <span style={{ color: "var(--accent)" }}>#</span>{globalIndex + 1}
                                </div>

                                {isDraggable && (
                                  <div className="flex items-center bg-black/75 backdrop-blur-md rounded-xl border border-white/15 p-0.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveProject(globalIndex, -1);
                                      }}
                                      disabled={globalIndex === 0}
                                      className="p-1 text-slate-300 hover:text-orange-400 disabled:opacity-20 transition-colors"
                                      title="Move Up (#1 higher in portfolio)"
                                    >
                                      <FiChevronUp size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveProject(globalIndex, 1);
                                      }}
                                      disabled={globalIndex === projects.length - 1}
                                      className="p-1 text-slate-300 hover:text-orange-400 disabled:opacity-20 transition-colors"
                                      title="Move Down (lower in portfolio)"
                                    >
                                      <FiChevronDown size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Right: Quick Actions (Edit & Delete) */}
                              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject(p);
                                    setProjectModalOpen(true);
                                  }}
                                  className="p-1 text-slate-300 hover:text-orange-400 transition-colors"
                                  title="Edit Project"
                                >
                                  <FiEdit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p._id || p.slug)}
                                  className="p-1 text-slate-300 hover:text-rose-400 transition-colors"
                                  title="Delete Project"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Featured indicator on bottom of Image */}
                            {p.featured && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <span
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-transparent shadow-sm"
                                  style={{ background: "var(--accent-gradient)" }}
                                >
                                  ★ Featured
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative rounded-2xl p-5 mb-5 h-36 flex flex-col justify-between border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-highlight)]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-xs font-mono font-bold text-white">
                                  {isDraggable && (
                                    <span
                                      className="cursor-grab active:cursor-grabbing text-orange-400 mr-0.5 hover:text-white"
                                      title="Drag to reorder"
                                    >
                                      <FiMove size={13} />
                                    </span>
                                  )}
                                  <span style={{ color: "var(--accent)" }}>#</span>{globalIndex + 1}
                                </div>

                                {isDraggable && (
                                  <div className="flex items-center bg-black/60 backdrop-blur-md rounded-xl border border-white/15 p-0.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveProject(globalIndex, -1);
                                      }}
                                      disabled={globalIndex === 0}
                                      className="p-1 text-slate-300 hover:text-orange-400 disabled:opacity-20 transition-colors"
                                      title="Move Up"
                                    >
                                      <FiChevronUp size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveProject(globalIndex, 1);
                                      }}
                                      disabled={globalIndex === projects.length - 1}
                                      className="p-1 text-slate-300 hover:text-orange-400 disabled:opacity-20 transition-colors"
                                      title="Move Down"
                                    >
                                      <FiChevronDown size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/15 p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject(p);
                                    setProjectModalOpen(true);
                                  }}
                                  className="p-1 text-slate-300 hover:text-orange-400 transition-colors"
                                  title="Edit Project"
                                >
                                  <FiEdit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p._id || p.slug)}
                                  className="p-1 text-slate-300 hover:text-rose-400 transition-colors"
                                  title="Delete Project"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className="px-3 py-1 rounded-full text-[11px] font-bold border"
                                style={{
                                  borderColor: "rgba(249, 115, 22, 0.3)",
                                  color: "var(--accent)",
                                  background: "rgba(249, 115, 22, 0.08)",
                                }}
                              >
                                REST API Architecture
                              </span>
                              <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                                Backend REST APIs
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Title & Description */}
                        <h3
                          onClick={() => {
                            setSelectedProject(p);
                            setProjectModalOpen(true);
                          }}
                          className="font-display text-xl font-bold mb-2 cursor-pointer hover:text-[var(--accent)] transition-colors line-clamp-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {p.title}
                        </h3>

                        <p
                          className="text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {p.description}
                        </p>
                      </div>

                      {/* Card Footer: Tech Stack Chips & Quick Edit */}
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {(p.tech || []).map((t) => (
                            <span
                              key={t}
                              className="pill-hover text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-default"
                              style={{
                                borderColor: "var(--glass-border)",
                                background: "var(--glass-bg)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div
                          className="flex items-center justify-between pt-4 border-t text-xs font-bold"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProject(p);
                              setProjectModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 hover:underline"
                            style={{ color: "var(--accent)" }}
                          >
                            <FiEdit2 size={13} />
                            <span>Edit Details</span>
                          </button>

                          {/* Live & Code Action Links */}
                          <div className="flex items-center gap-2">
                            {p.link && (
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noreferrer"
                                title="Open Live Demo"
                                className="glass px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                                style={{
                                  borderColor: "var(--glass-border)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                <FiExternalLink size={12} style={{ color: "var(--accent)" }} /> Live
                              </a>
                            )}
                            {p.github && (
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noreferrer"
                                title="View GitHub repository"
                                className="glass px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                                style={{
                                  borderColor: "var(--glass-border)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                <FiGithub size={12} /> Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== TAB: OVERVIEW & ANALYTICS ===================== */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Visits */}
                <div className="glass card-hover p-6 rounded-3xl border flex flex-col justify-between" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Total Visits
                    </span>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ background: "var(--accent-gradient)" }}
                    >
                      <FiEye size={18} />
                    </div>
                  </div>
                  <div className="my-1">
                    <div className="text-4xl font-extrabold font-display heading-accent mb-4" style={{ color: "var(--text-primary)" }}>
                      {stats?.totalVisits ?? 0}
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    Cumulative pageviews recorded
                  </p>
                </div>

                {/* Unique Visitors */}
                <div className="glass card-hover p-6 rounded-3xl border flex flex-col justify-between" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Unique Visitors
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white grid place-items-center shadow-md">
                      <FiUsers size={18} />
                    </div>
                  </div>
                  <div className="my-1">
                    <div className="text-4xl font-extrabold font-display heading-accent mb-4" style={{ color: "var(--text-primary)" }}>
                      {stats?.uniqueVisitors ?? 0}
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    Distinct visitor devices / IPs
                  </p>
                </div>

                {/* CV Downloads */}
                <div className="glass card-hover p-6 rounded-3xl border flex flex-col justify-between" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      CV Downloads
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white grid place-items-center shadow-md">
                      <FiDownload size={18} />
                    </div>
                  </div>
                  <div className="my-1">
                    <div className="text-4xl font-extrabold font-display heading-accent mb-4" style={{ color: "var(--text-primary)" }}>
                      {stats?.totalDownloads ?? 0}
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    Resume download requests
                  </p>
                </div>

                {/* Inquiries */}
                <div className="glass card-hover p-6 rounded-3xl border flex flex-col justify-between" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Messages
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white grid place-items-center shadow-md">
                      <FiMail size={18} />
                    </div>
                  </div>
                  <div className="my-1">
                    <div className="text-4xl font-extrabold font-display heading-accent mb-4" style={{ color: "var(--text-primary)" }}>
                      {stats?.totalMessages ?? 0}
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    <span className="font-bold" style={{ color: "var(--accent)" }}>
                      {stats?.unreadMessages ?? 0}
                    </span>{" "}
                    unread in inbox
                  </p>
                </div>
              </div>

              {/* Analytics Lists Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Visits Table */}
                <div className="glass p-6 rounded-3xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <FiEye style={{ color: "var(--accent)" }} /> Recent Page Visits
                    </h3>
                    <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                      Last 10 visits
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto p-1.5 pr-2">
                    {(!stats?.recentVisits || stats.recentVisits.length === 0) ? (
                      <div className="py-12 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                        No visits recorded yet.
                      </div>
                    ) : (
                      stats.recentVisits.map((v, i) => (
                        <div
                          key={v._id || i}
                          className="glass flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all duration-200 hover:border-[var(--accent)] hover:bg-white/[0.04] hover:translate-x-1 hover:shadow-md"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <div className="min-w-0 pr-3">
                            <span className="font-bold block truncate" style={{ color: "var(--text-primary)" }}>
                              {v.page || "/"}
                            </span>
                            <span className="text-[11px] block truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                              Referrer: <span style={{ color: "var(--accent)" }}>{v.referrer || "direct"}</span>
                            </span>
                          </div>
                          <span className="font-mono text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>
                            {new Date(v.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Resume Downloads Table */}
                <div className="glass p-6 rounded-3xl border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <FiDownload style={{ color: "var(--accent)" }} /> Recent Resume Downloads
                    </h3>
                    <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                      Tracked events
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto p-1.5 pr-2">
                    {(!stats?.recentDownloads || stats.recentDownloads.length === 0) ? (
                      <div className="py-12 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                        No downloads recorded yet.
                      </div>
                    ) : (
                      stats.recentDownloads.map((d, i) => (
                        <div
                          key={d._id || i}
                          className="glass flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all duration-200 hover:border-[var(--accent)] hover:bg-white/[0.04] hover:translate-x-1 hover:shadow-md"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <div className="min-w-0 pr-3">
                            <span className="font-bold block truncate" style={{ color: "var(--text-primary)" }}>
                              Resume / CV Download
                            </span>
                            <span className="text-[11px] block truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                              Client: {d.userAgent ? d.userAgent.slice(0, 38) + "..." : "Browser"}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-bold shrink-0" style={{ color: "var(--accent)" }}>
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

          {/* ===================== TAB: SKILLS MANAGER ===================== */}
          {activeTab === "skills" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((s) => (
                  <div
                    key={s._id || s.tag}
                    className="glass card-hover rounded-3xl p-6 flex flex-col justify-between border"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-sm font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
                          {s.category}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border glass"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {s.tag}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(s.items || []).map((item) => (
                          <span
                            key={item}
                            className="pill-hover text-xs font-semibold px-3 py-1.5 rounded-xl glass border"
                            style={{
                              borderColor: "var(--glass-border)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-end gap-2 pt-4 border-t"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <button
                        onClick={() => {
                          setSelectedSkill(s);
                          setSkillModalOpen(true);
                        }}
                        className="glass px-3 py-1.5 rounded-xl text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center gap-1.5 transition-colors border border-[var(--glass-border)]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiEdit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s._id || s.tag)}
                        className="glass px-3 py-1.5 rounded-xl text-xs font-semibold hover:border-rose-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors border border-[var(--glass-border)]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: RESUME MANAGEMENT ===================== */}
          {activeTab === "resume" && (
            <ResumeManager onResumeUpdated={onDataUpdated} refreshTrigger={loading} />
          )}

          {/* ===================== TAB: MESSAGES INBOX ===================== */}
          {activeTab === "messages" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Message Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5 overflow-x-auto p-1.5 pl-2.5">
                  {[
                    { id: "all", label: `All Messages (${messages.length})` },
                    { id: "unread", label: `Unread (${unreadCount})` },
                    { id: "read", label: `Read (${messages.length - unreadCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMessageFilter(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border shrink-0 ${
                        messageFilter === tab.id
                          ? "text-white border-transparent shadow-md scale-105"
                          : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:scale-[1.02]"
                      }`}
                      style={
                        messageFilter === tab.id
                          ? {
                              background: "var(--accent-gradient)",
                              boxShadow: "0 4px 16px -2px rgba(234, 88, 12, 0.35)",
                            }
                          : {}
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {unreadCount} pending inquiry message(s)
                </span>
              </div>

              {filteredMessages.length === 0 ? (
                <div
                  className="glass p-16 text-center rounded-3xl border"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <FiMail size={36} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    No messages in this folder
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Inquiries submitted from your portfolio will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((m) => (
                    <div
                      key={m._id}
                      className={`glass card-hover rounded-3xl p-6 transition-all border ${
                        !m.isRead ? "border-l-4 border-l-[var(--accent)]" : ""
                      }`}
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-base font-display" style={{ color: "var(--text-primary)" }}>
                            {m.name}
                          </span>
                          <a
                            href={`mailto:${m.email}`}
                            className="text-xs font-mono hover:underline"
                            style={{ color: "var(--accent)" }}
                          >
                            &lt;{m.email}&gt;
                          </a>
                          {!m.isRead && (
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                              style={{ background: "var(--accent-gradient)" }}
                            >
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div
                        className="glass p-4 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed border mb-4"
                        style={{
                          borderColor: "var(--glass-border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {m.message}
                      </div>

                      <div className="flex items-center justify-end gap-2.5">
                        <a
                          href={`mailto:${m.email}?subject=Re: Portfolio Inquiry&body=Hi ${m.name},%0D%0A%0D%0AThank you for reaching out!`}
                          className="btn-primary btn-shine px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <FiCornerUpRight size={13} />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          onClick={() => handleToggleMessageRead(m._id, m.isRead)}
                          className="glass px-4 py-2 rounded-xl text-xs font-semibold hover:border-[var(--accent)] transition-colors border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {m.isRead ? "Mark Unread" : "Mark as Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(m._id)}
                          className="glass p-2 rounded-xl hover:border-rose-500 hover:text-rose-400 transition-colors border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-secondary)",
                          }}
                          title="Delete Message"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Floating Action Button (FAB) for Projects & Skills */}
      <div className="md:hidden fixed bottom-6 right-6 z-40 pointer-events-auto flex flex-col items-end">
        {activeTab === "projects" && (
          <button
            type="button"
            onClick={() => {
              setSelectedProject(null);
              setProjectModalOpen(true);
            }}
            className="btn-primary btn-shine inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold shadow-2xl transition-transform active:scale-95 cursor-pointer"
            style={{
              boxShadow: "0 8px 25px -2px rgba(234, 88, 12, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.5)",
            }}
            aria-label="Add Project"
          >
            <FiPlus size={16} />
            <span>Add Project</span>
          </button>
        )}

        {activeTab === "skills" && (
          <button
            type="button"
            onClick={() => {
              setSelectedSkill(null);
              setSkillModalOpen(true);
            }}
            className="btn-primary btn-shine inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold shadow-2xl transition-transform active:scale-95 cursor-pointer"
            style={{
              boxShadow: "0 8px 25px -2px rgba(234, 88, 12, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.5)",
            }}
            aria-label="Add Category"
          >
            <FiPlus size={16} />
            <span>Add Category</span>
          </button>
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
  );
};

export default AdminDashboard;
