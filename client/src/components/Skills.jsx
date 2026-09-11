import { useState, useEffect } from "react";
import { skills as staticSkills } from "../data";
import { useReveal } from "../hooks/useReveal";
import { getSkillIcon, getSkillColor } from "./skillIcons";
import { FiCode, FiLayers } from "react-icons/fi";
import { api } from "../services/api";

const Skills = ({ refreshTrigger }) => {
  const ref = useReveal();
  const [activeTab, setActiveTab] = useState("all");
  const [skillList, setSkillList] = useState(staticSkills);

  useEffect(() => {
    let isMounted = true;
    api.getSkills()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSkillList(data);
        }
      })
      .catch((err) => {
        console.log("Using static skills data fallback:", err.message);
      });
    return () => { isMounted = false; };
  }, [refreshTrigger]);

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
      ? skillList
      : skillList.filter((group) => group.tag === activeTab);

  return (
    <section id="skills" className="section-tint tint-violet py-16 sm:py-20 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="reveal mb-10 flex flex-col items-center justify-center text-center space-y-2.5">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono tracking-widest uppercase font-semibold"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--accent)",
              background: "var(--glass-bg)",
            }}
          >
            <FiLayers size={13} />
            <span>Technical Capabilities</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Skills
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-8">
          {filterOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((group, i) => (
            <div
              key={group.category}
              className="reveal card-hover glass p-6 rounded-3xl flex flex-col justify-start"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <h3
                  className="font-display text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {group.category}
                </h3>
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = getSkillIcon(item);
                  const brandColor = getSkillColor(item);

                  return (
                    <span
                      key={item}
                      className="pill-hover group inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                      style={{
                        borderColor: "var(--glass-border)",
                        background: "var(--glass-bg)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        className="transition-transform group-hover:scale-110"
                        style={{ color: brandColor }}
                      >
                        <Icon size={14} />
                      </span>
                      <span>{item}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

