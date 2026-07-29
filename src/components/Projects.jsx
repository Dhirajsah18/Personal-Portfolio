import { useState } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
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

  return (
    <section id="projects" className="section-tint tint-violet py-20 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="reveal mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent)" }}>
            Selected work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold heading-accent inline-block" style={{ color: "var(--text-primary)" }}>
            Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const img = project.image ? imageMap[project.image] : null;
            return (
              <div
                key={project.title}
                onClick={() => setSelected(project)}
                className="reveal card-hover glass group cursor-pointer p-6 flex flex-col transition-transform"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {img && (
                  <div className="relative rounded-xl overflow-hidden mb-4 h-40">
                    <img
                      src={img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.35) 100%)" }}
                    />
                  </div>
                )}

                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {project.title}
                </h3>
                <p className="text-sm mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="pill-hover text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "var(--glass-border)", color: "var(--text-secondary)" }}
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[11px] font-semibold px-2 py-1" style={{ color: "var(--accent)" }}>
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>

                <span className="link-underline text-xs font-semibold mt-2 inline-block w-fit" style={{ color: "var(--accent)" }}>
                  View details →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass modal-glow relative max-w-lg w-full p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full glass icon-ring hover:rotate-90 transition-transform"
              style={{ color: "var(--text-primary)" }}
            >
              <FiX />
            </button>

            {selected.image && imageMap[selected.image] && (
              <img
                src={imageMap[selected.image]}
                alt={selected.title}
                className="w-full h-44 object-cover rounded-xl mb-4"
              />
            )}

            <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {selected.title}
            </h3>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {selected.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selected.tech.map((t) => (
                <span
                  key={t}
                  className="pill-hover text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-secondary)" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {selected.link && (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  <FiExternalLink /> Live site
                </a>
              )}
              {selected.github && (
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  <FiGithub /> Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
