import { useState } from "react";
import { skills } from "../data";
import { useReveal } from "../hooks/useReveal";
import { getSkillIcon, getSkillColor } from "./skillIcons";
import { FiCode, FiLayers } from "react-icons/fi";

const Skills = () => {
  const ref = useReveal();
  const [activeTab, setActiveTab] = useState("all");

  const filterOptions = [
    { id: "all", label: "All Skills" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend & APIs" },
    { id: "database", label: "Databases" },
    { id: "languages", label: "Languages" },
    { id: "tools", label: "Tools" },
  ];

  const filteredSkills =
    activeTab === "all"
      ? skills
      : skills.filter((group) => group.tag === activeTab);

  return (
    <section id="skills" className="section-tint tint-violet py-24 px-4">
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
            <FiLayers size={13} />
            <span>Tech Stack & Capabilities</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Skills
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-10">
          {filterOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white border-transparent shadow-md scale-105"
                  : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((group, i) => (
            <div
              key={group.category}
              className="reveal card-hover glass p-7 flex flex-col justify-between"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="font-display text-lg font-bold flex items-center gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    {group.category}
                  </h3>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: "var(--glass-border)",
                      color: "var(--text-muted)",
                      background: "var(--glass-bg)",
                    }}
                  >
                    {group.items.length} skills
                  </span>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => {
                    const Icon = getSkillIcon(item);
                    const brandColor = getSkillColor(item);

                    return (
                      <span
                        key={item}
                        className="pill-hover group inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all"
                        style={{
                          borderColor: "var(--glass-border)",
                          background: "var(--glass-bg)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span
                          className="transition-transform group-hover:scale-125"
                          style={{ color: brandColor }}
                        >
                          <Icon size={15} />
                        </span>
                        <span>{item}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between text-[11px]" style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <FiCode size={12} style={{ color: "var(--accent)" }} /> Production Ready
                </span>
                <span className="font-mono text-[10px]">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

