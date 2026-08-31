import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiExternalLink, FiGithub, FiX, FiFolder, FiCheckCircle, FiMaximize2 } from "react-icons/fi";
import { projects } from "../data";
import { useReveal } from "../hooks/useReveal";
import videoSummarizerImg from "../assets/video-summarizer.jpg";
import creativeShowcaseImg from "../assets/creative-showcase.jpg";
import vtubeImg from "/vtube.jpg";

const imageMap = {
  "video-summarizer": videoSummarizerImg,
  "creative-showcase": creativeShowcaseImg,
  vtube: vtubeImg,
};

const Projects = () => {
  const ref = useReveal();
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (selected) {
      // Complete background freeze on both html and body for Desktop, iOS & Android
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selected]);

  const filterTabs = [
    { id: "all", label: "All Projects" },
    { id: "fullstack", label: "Full-Stack MERN" },
    { id: "ai", label: "AI & Tools" },
    { id: "backend", label: "Backend & APIs" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-tint tint-cyan py-24 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="reveal mb-12 flex flex-col items-center justify-center text-center space-y-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase font-semibold"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--accent)",
              background: "var(--glass-bg)",
            }}
          >
            <FiFolder size={13} />
            <span>Featured Portfolio</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Projects
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                activeCategory === tab.id
                  ? "bg-[var(--accent)] text-white border-transparent shadow-md scale-105"
                  : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-7">
          {filteredProjects.map((project, i) => {
            const img = project.image ? imageMap[project.image] : null;

            return (
              <div
                key={project.title}
                className="reveal card-hover glass flex flex-col justify-between p-6 sm:p-7 rounded-3xl group"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div>
                  {/* Visual Preview / Header */}
                  {img ? (
                    <div
                      onClick={() => setSelected(project)}
                      className="relative rounded-2xl overflow-hidden mb-5 h-48 cursor-pointer bg-slate-900 border border-[var(--glass-border)]"
                    >
                      <img
                        src={img}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {/* Floating Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/10">
                        {project.badge}
                      </span>

                      {/* Quick view overlay icon */}
                      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                        <FiMaximize2 size={16} />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelected(project)}
                      className="relative rounded-2xl p-6 mb-5 h-36 flex flex-col justify-between cursor-pointer border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-highlight)]"
                    >
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold text-[var(--accent)] border border-[var(--accent)]/30 w-fit">
                        {project.badge}
                      </span>
                      <p className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-2">
                        <span>REST API Backend Architecture</span>
                        <FiMaximize2 size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  )}

                  {/* Title & Description */}
                  <h3
                    onClick={() => setSelected(project)}
                    className="font-display text-xl sm:text-2xl font-bold mb-2.5 cursor-pointer hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-sm line-clamp-3 mb-5 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Card Footer: Bordered Tech Stack Chips with Hover & Action Links */}
                <div>
                  {/* Tech stack pills with border and interactive hover */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
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

                  {/* Action Buttons */}
                  <div
                    className="flex items-center gap-3 pt-4 border-t"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <button
                      onClick={() => setSelected(project)}
                      className="text-xs font-bold flex items-center gap-1 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Case Study <FiExternalLink size={12} />
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open live app"
                          className="glass icon-ring px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <FiExternalLink size={13} style={{ color: "var(--accent)" }} /> Live
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View GitHub repository"
                          className="glass icon-ring px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <FiGithub size={13} /> Code
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

      {/* Immersive Single-Page Project Case Study Modal (Portaled to document.body) */}
      {selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6"
            style={{ touchAction: "none" }}
            onClick={() => setSelected(null)}
          >
            <div
              className="glass relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl border border-[var(--glass-border)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              style={{
                background: "var(--modal-bg)",
                overscrollBehavior: "contain",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                    {selected.badge || "Case Study"}
                  </span>
                  <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-mono">
                    • Project Architecture & Specs
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close modal"
                  className="w-9 h-9 grid place-items-center rounded-full glass border border-[var(--glass-border)] hover:rotate-90 transition-transform cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FiX size={17} />
                </button>
              </div>

              {/* Modal Content: Responsive 2-Column Single Screen View */}
              <div className="overflow-y-auto lg:overflow-visible p-6 sm:p-8">
                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8 items-start">
                  {/* LEFT COLUMN: Visual Media & Action CTAs */}
                  <div className="space-y-4">
                    {selected.image && imageMap[selected.image] ? (
                      <div className="relative rounded-2xl overflow-hidden h-52 sm:h-64 lg:h-[300px] border border-[var(--glass-border)] shrink-0 shadow-md">
                        <img
                          src={imageMap[selected.image]}
                          alt={selected.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-2xl p-6 h-52 sm:h-64 lg:h-[300px] flex flex-col justify-center items-center text-center border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-md">
                        <span className="text-sm font-mono text-[var(--accent)] font-bold mb-2">
                          Backend REST API Architecture
                        </span>
                        <p className="text-xs text-[var(--text-muted)] max-w-xs">
                          JWT Authentication, Role-based Access & Scalable Data Pipelines
                        </p>
                      </div>
                    )}

                    {/* Direct Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      {selected.link && (
                        <a
                          href={selected.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold shadow-md"
                        >
                          <FiExternalLink size={15} /> Live Demo
                        </a>
                      )}
                      {selected.github && (
                        <a
                          href={selected.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <FiGithub size={15} /> Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Project Details, Deliverables & Stack */}
                  <div className="space-y-5 flex flex-col justify-between">
                    <div>
                      <h3
                        className="font-display text-2xl sm:text-3xl font-extrabold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selected.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {selected.description}
                      </p>
                    </div>

                    {/* Key Highlights / Deliverables */}
                    {selected.highlights && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                          Key Architecture & Features
                        </p>
                        <div className="space-y-2">
                          {selected.highlights.map((hl) => (
                            <div
                              key={hl}
                              className="glass px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 border border-[var(--glass-border)]"
                            >
                              <FiCheckCircle size={15} className="text-emerald-400 shrink-0" />
                              <span style={{ color: "var(--text-primary)" }}>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technologies Used */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tech.map((t) => (
                          <span
                            key={t}
                            className="pill-hover text-xs font-semibold px-3 py-1 rounded-full border"
                            style={{
                              borderColor: "var(--glass-border)",
                              background: "var(--glass-bg)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default Projects;
